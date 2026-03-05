import React from 'react';
import { Text } from 'react-native';
import { getCategoryInfo } from '../../constants/transactionCategories';

interface CategoryIconProps {
  category: string;
  size?: number;
}

export function CategoryIcon({ category, size = 20 }: CategoryIconProps) {
  const info = getCategoryInfo(category);
  return (
    <Text style={{ fontSize: size }}>{info.icon}</Text>
  );
}

