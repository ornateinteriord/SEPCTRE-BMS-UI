import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';

interface RupeeIconProps {
  sx?: SxProps<Theme>;
  className?: string;
}

const RupeeIcon: React.FC<RupeeIconProps> = ({ sx, className }) => {
  return (
    <Box
      component="span"
      className={className}
      sx={{
        display: 'inline-block',
        verticalAlign: 'middle',
        fontFamily: 'inherit',
        fontWeight: 'bold',
        ...sx,
      }}
    >
      $
    </Box>
  );
};

export default RupeeIcon;
