import Chip from '@mui/material/Chip';
import type { RecyclingCategory } from '../../types/recycling';
import { categoryToColor, categoryLabel } from '../../utils/categoryColors';

interface CategoryBadgeProps {
  category: RecyclingCategory;
  size?: 'small' | 'medium';
}

export function CategoryBadge({ category, size = 'small' }: CategoryBadgeProps) {
  return (
    <Chip
      label={categoryLabel[category]}
      color={categoryToColor[category]}
      size={size}
      sx={{ fontWeight: 600 }}
    />
  );
}
