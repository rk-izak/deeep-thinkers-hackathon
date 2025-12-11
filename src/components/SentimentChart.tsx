import { useState } from 'react';
import type { SentimentHistoryEntry } from '../lib/leadsApi';

interface SentimentChartProps {
  history: SentimentHistoryEntry[];
}

export function SentimentChart({ history }: SentimentChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  if (history.length === 0) {
    return (
      <div className="text-gray-500 text-center py-12">
        No sentiment data available
      </div>
    );
  }

  const width = 600;
  const height = 300;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const minScore = 0;
  const maxScore = 100;

  const getX = (index: number) => {
    return padding.left + (index / Math.max(history.length - 1, 1)) * chartWidth;
  };

  const getY = (score: number) => {
    return padding.top + chartHeight - ((score - minScore) / (maxScore - minScore)) * chartHeight;
  };

  const pathData = history
    .map((entry, index) => {
      const x = getX(index);
      const y = getY(entry.score);
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');

  const areaData = `${pathData} L ${getX(history.length - 1)} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`;

  function formatTime(timestamp: string) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function getSentimentColor(score: number) {
    if (score >= 70) return '#10b981';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  }

  return (
    <div className="relative">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <linearGradient id="sentimentGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + chartHeight}
          stroke="#e5e7eb"
          strokeWidth="2"
        />
        <line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={padding.left + chartWidth}
          y2={padding.top + chartHeight}
          stroke="#e5e7eb"
          strokeWidth="2"
        />

        {[0, 25, 50, 75, 100].map((score) => {
          const y = getY(score);
          return (
            <g key={score}>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + chartWidth}
                y2={y}
                stroke="#f3f4f6"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                className="text-xs fill-gray-500"
              >
                {score}
              </text>
            </g>
          );
        })}

        <path d={areaData} fill="url(#sentimentGradient)" />

        <path d={pathData} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {history.map((entry, index) => {
          const x = getX(index);
          const y = getY(entry.score);
          const isHovered = hoveredPoint === index;

          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 8 : 6}
                fill={getSentimentColor(entry.score)}
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredPoint(index)}
                onMouseLeave={() => setHoveredPoint(null)}
              />

              {isHovered && (
                <g>
                  <foreignObject
                    x={x > chartWidth / 2 ? x - 250 : x + 10}
                    y={y < 100 ? y + 20 : y - 90}
                    width="240"
                    height="80"
                  >
                    <div className="bg-gray-900 text-white rounded-lg shadow-xl p-3 text-sm pointer-events-none">
                      <div className="font-semibold mb-1">
                        Score: {entry.score}
                      </div>
                      <div className="text-gray-300 text-xs mb-1">
                        {formatTime(entry.timestamp)}
                      </div>
                      <div className="text-gray-100 text-xs">
                        {entry.reason}
                      </div>
                    </div>
                  </foreignObject>
                </g>
              )}
            </g>
          );
        })}

        {history.length <= 6 && history.map((entry, index) => {
          const x = getX(index);
          return (
            <text
              key={index}
              x={x}
              y={padding.top + chartHeight + 20}
              textAnchor="middle"
              className="text-xs fill-gray-500"
            >
              {formatTime(entry.timestamp)}
            </text>
          );
        })}
      </svg>

      <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Positive (70+)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span>Neutral (40-69)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Negative (0-39)</span>
        </div>
      </div>
    </div>
  );
}
