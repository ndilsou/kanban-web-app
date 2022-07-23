import { FC } from "react";

export interface IconProps {
  className: string;
}

export const MobileLogo: FC<IconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 25"
      className={className}
    >
      <g fill="#635FC7" fillRule="evenodd">
        <rect width="6" height="25" rx="2" />
        <rect opacity=".75" x="9" width="6" height="25" rx="2" />
        <rect opacity=".5" x="18" width="6" height="25" rx="2" />
      </g>
    </svg>
  );
};

// export const Logo: FC<IconProps> = ({ className }) => {
//   return <></>;
// };
