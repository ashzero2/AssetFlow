import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { formatCurrency, formatPercentage } from '../../utils/currency';
import { ASSET_TYPE_COLORS, ASSET_TYPE_SHORT } from '../../constants/assetTypes';
import { AssetGroup } from '../../utils/calculations';

interface AssetGroupCardProps {
  group: AssetGroup;
  onLotPress: (assetId: number) => void;
  onUpdateGroupPrice: (groupKey: string, isTicker: boolean, newPrice: number) => void;
}

export function AssetGroupCard({ group, onLotPress, onUpdateGroupPrice }: AssetGroupCardProps) {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [priceEditOpen, setPriceEditOpen] = useState(false);
  const [priceInput, setPriceInput] = useState('');
  const inputRef = useRef<TextInput>(null);
  const typeColor = ASSET_TYPE_COLORS[group.type] ?? theme.colors.primary;
  const isPositive = group.pnlAmount >= 0;
  const isMultiLot = group.lots.length > 1;

  const handlePress = () => {
    if (priceEditOpen) return;
    if (isMultiLot) {
      setExpanded(e => !e);
    } else {
      onLotPress(group.lots[0].id);
    }
  };

  const openPriceEdit = () => {
    setPriceInput(group.currentPrice > 0 ? String(group.currentPrice) : '');
    setPriceEditOpen(true);
    setTimeout(() => inputRef.current?.focus(), 80);
  };

  const confirmPrice = () => {
    const val = parseFloat(priceInput);
    if (!isNaN(val) && val > 0) {
      onUpdateGroupPrice(group.groupKey, !!group.ticker?.trim(), val);
    }
    setPriceEditOpen(false);
    Keyboard.dismiss();
  };

  const cancelPrice = () => {
    setPriceEditOpen(false);
    Keyboard.dismiss();
  };

  return (
    <View style={{
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: theme.isDark ? 0.3 : 0.06,
      shadowRadius: 4,
      elevation: 2,
      overflow: 'hidden',
    }}>
      {/* Main row */}
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: theme.spacing.md }}>
          {/* Type badge */}
          <View style={{
            width: 44, height: 44, borderRadius: 12,
            backgroundColor: `${typeColor}22`,
            alignItems: 'center', justifyContent: 'center', marginRight: 12,
          }}>
            <Text style={{ fontSize: 10, fontWeight: theme.fontWeight.bold, color: typeColor }}>
              {ASSET_TYPE_SHORT[group.type]}
            </Text>
          </View>

          {/* Info */}
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold,
              color: theme.colors.text, marginBottom: 2,
            }} numberOfLines={1}>{group.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <Text style={{ fontSize: theme.fontSize.xs, color: theme.colors.textSecondary }}>
                {group.ticker ? `${group.ticker} · ` : ''}{group.totalUnits} units
              </Text>
              {isMultiLot && (
                <View style={{
                  flexDirection: 'row', alignItems: 'center', gap: 3,
                  backgroundColor: `${typeColor}18`,
                  borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2,
                }}>
                  <Ionicons name="layers-outline" size={10} color={typeColor} />
                  <Text style={{ fontSize: 10, color: typeColor, fontWeight: theme.fontWeight.medium }}>
                    {group.lots.length} lots
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Value & P&L */}
          <View style={{ alignItems: 'flex-end', marginRight: isMultiLot ? 6 : 0 }}>
            <Text style={{
              fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold,
              color: theme.colors.text,
            }}>{formatCurrency(group.totalCurrentValue)}</Text>
            {group.totalUnits > 0 && group.avgBuyPrice > 0 && (
              <View style={{
                flexDirection: 'row', alignItems: 'center',
                backgroundColor: isPositive ? theme.colors.incomeMuted : theme.colors.expenseMuted,
                paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginTop: 3,
              }}>
                <Text style={{
                  fontSize: theme.fontSize.xs, fontWeight: theme.fontWeight.semibold,
                  color: isPositive ? theme.colors.income : theme.colors.expense,
                }}>{formatPercentage(group.pnlPercent)}</Text>
              </View>
            )}
          </View>

          {/* Expand chevron */}
          {isMultiLot && (
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={theme.colors.textSecondary}
            />
          )}
        </View>
      </TouchableOpacity>

      {/* ── Update Price row — always visible ── */}
      <View style={{
        borderTopWidth: 1, borderTopColor: theme.colors.border,
        backgroundColor: theme.isDark ? `${typeColor}08` : `${typeColor}05`,
      }}>
        {!priceEditOpen ? (
          <TouchableOpacity
            onPress={openPriceEdit}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row', alignItems: 'center',
              paddingHorizontal: 14, paddingVertical: 9,
            }}
          >
            <Ionicons name="pricetag-outline" size={13} color={theme.colors.textSecondary} style={{ marginRight: 6 }} />
            <Text style={{ flex: 1, fontSize: theme.fontSize.xs, color: theme.colors.textSecondary }}>
              Current: <Text style={{ color: theme.colors.text, fontWeight: theme.fontWeight.medium }}>
                {formatCurrency(group.currentPrice)}/unit
              </Text>
            </Text>
            <View style={{
              flexDirection: 'row', alignItems: 'center', gap: 4,
              backgroundColor: `${typeColor}18`, borderRadius: 8,
              paddingHorizontal: 10, paddingVertical: 4,
            }}>
              <Ionicons name="create-outline" size={12} color={typeColor} />
              <Text style={{ fontSize: 11, color: typeColor, fontWeight: theme.fontWeight.semibold }}>
                Update Price
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={{
            flexDirection: 'row', alignItems: 'center',
            paddingHorizontal: 14, paddingVertical: 8, gap: 8,
          }}>
            <Ionicons name="pricetag-outline" size={13} color={typeColor} style={{ marginRight: 2 }} />
            <TextInput
              ref={inputRef}
              value={priceInput}
              onChangeText={setPriceInput}
              keyboardType="decimal-pad"
              placeholder="New price per unit"
              placeholderTextColor={theme.colors.textSecondary}
              style={{
                flex: 1, fontSize: theme.fontSize.sm,
                color: theme.colors.text,
                borderWidth: 1, borderColor: typeColor,
                borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6,
                backgroundColor: theme.colors.surface,
              }}
              onSubmitEditing={confirmPrice}
              returnKeyType="done"
            />
            <TouchableOpacity
              onPress={confirmPrice}
              style={{
                width: 32, height: 32, borderRadius: 8,
                backgroundColor: typeColor,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Ionicons name="checkmark" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={cancelPrice}
              style={{
                width: 32, height: 32, borderRadius: 8,
                backgroundColor: theme.colors.surfaceAlt,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Ionicons name="close" size={18} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Expanded lot rows */}
      {expanded && isMultiLot && (
        <View style={{
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          backgroundColor: theme.colors.background,
        }}>
          {/* Aggregate summary row */}
          <View style={{
            flexDirection: 'row', justifyContent: 'space-between',
            paddingHorizontal: 16, paddingVertical: 8,
            borderBottomWidth: 1, borderBottomColor: theme.colors.border,
          }}>
            <Text style={{ fontSize: theme.fontSize.xs, color: theme.colors.textSecondary }}>
              Avg buy: {formatCurrency(group.avgBuyPrice)} · Current: {formatCurrency(group.currentPrice)}
            </Text>
            <Text style={{
              fontSize: theme.fontSize.xs, fontWeight: theme.fontWeight.semibold,
              color: isPositive ? theme.colors.income : theme.colors.expense,
            }}>
              {isPositive ? '+' : ''}{formatCurrency(group.pnlAmount)}
            </Text>
          </View>

          {/* Individual lot rows */}
          {group.lots.map((lot, i) => (
            <TouchableOpacity
              key={lot.id}
              onPress={() => onLotPress(lot.id)}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row', alignItems: 'center',
                paddingHorizontal: 16, paddingVertical: 11,
                borderBottomWidth: i < group.lots.length - 1 ? 1 : 0,
                borderBottomColor: theme.colors.border,
              }}
            >
              <View style={{
                width: 24, height: 24, borderRadius: 6,
                backgroundColor: `${typeColor}18`,
                alignItems: 'center', justifyContent: 'center', marginRight: 10,
              }}>
                <Text style={{ fontSize: 9, color: typeColor, fontWeight: theme.fontWeight.bold }}>
                  L{i + 1}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: theme.fontSize.sm, color: theme.colors.text, fontWeight: theme.fontWeight.medium }}>
                  Lot {i + 1} · {lot.units} units
                </Text>
                <Text style={{ fontSize: theme.fontSize.xs, color: theme.colors.textSecondary }}>
                  Buy: {formatCurrency(lot.buy_price)} / unit
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.semibold, color: theme.colors.text }}>
                  {formatCurrency(lot.current_value)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color={theme.colors.textSecondary} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
