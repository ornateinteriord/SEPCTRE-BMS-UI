import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';

interface SmallRupeeIconProps {
  sx?: SxProps<Theme>;
  className?: string;
}

const SmallRupeeIcon: React.FC<SmallRupeeIconProps> = ({ sx, className }) => {
  return (
    <Box
      component="img"
      src="/B3_1.png"
      alt="$"
      className={className}
      sx={{
        display: 'inline-block',
        verticalAlign: 'middle',
        width: '1em',
        height: '1em',
        objectFit: 'contain',
        ...sx,
      }}
    />
  );
};

export default SmallRupeeIcon;
