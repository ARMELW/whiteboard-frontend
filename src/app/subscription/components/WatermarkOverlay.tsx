interface WatermarkOverlayProps {
  text?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  opacity?: number;
}

export function WatermarkOverlay({
  text = 'Whiteboard Animation',
  position = 'bottom-right',
  opacity = 0.3,
}: WatermarkOverlayProps) {
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'center':
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      default:
        return 'bottom-4 right-4';
    }
  };

  return (
    <div
      className={`absolute ${getPositionClasses()} pointer-events-none select-none`}
      style={{ opacity }}
    >
      <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-gray-200">
        <span className="text-sm font-medium text-gray-700">{text}</span>
      </div>
    </div>
  );
}
