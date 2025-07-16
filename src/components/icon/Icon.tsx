type IconProps = {
  id: string;
  width?: number;
  height?: number;
  color?: string;
  xPos?: number;
  yPos?: number;
} & React.SVGAttributes<SVGElement>;

const Icon = ({
  id,
  width = 24,
  height,
  color = '#757575',
  xPos = 0,
  yPos = 0,
  ...restProps
}: IconProps) => {
  if (!height) height = width;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`${xPos} ${yPos} ${width} ${height}`}
      style={{ display: 'block', minWidth: width, minHeight: height, color }}
      {...restProps}
    >
      <use href={`/icons/sprites.svg#${id}`} />
    </svg>
  );
};

export default Icon;
