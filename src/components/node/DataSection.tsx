/**
 * Renders the Data Section of a node.
 * According to requirements, ONLY topic and heading are visible on the canvas.
 */
import type { DataSectionData } from '../../types/node';

const FONT_HEADLINE = "'Space Grotesk', sans-serif";
const FONT_BODY = "'Inter', system-ui, sans-serif";
const C = {
  primary: '#00f2ff',
  onSurfaceVariant: '#b9cacb',
};

interface DataSectionProps {
  data: DataSectionData;
  isSmall?: boolean;
}

export default function DataSection({ data, isSmall }: DataSectionProps) {
  const { topic, heading } = data.actualData;

  if (isSmall) {
    return (
      <div>
        <span style={{ display: 'block', fontFamily: FONT_BODY, fontSize: 9, color: C.onSurfaceVariant, marginBottom: 2 }}>{topic}</span>
        <h4 style={{ fontFamily: FONT_HEADLINE, fontSize: 13, color: '#fff', margin: '0 0 4px', lineHeight: 1.3 }}>{heading}</h4>
      </div>
    );
  }

  return (
    <div>
      <span style={{ display: 'block', fontFamily: FONT_BODY, fontSize: 11, color: C.primary, marginBottom: 4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {topic}
      </span>
      <h3 style={{ fontFamily: FONT_HEADLINE, fontSize: 16, fontWeight: 600, color: '#fff', margin: '0 0 8px', lineHeight: 1.3 }}>
        {heading}
      </h3>
    </div>
  );
}
