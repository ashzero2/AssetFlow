import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../src/theme';
import { useGoalsStore } from '../../../src/store/useGoalsStore';
import { useAssetsStore } from '../../../src/store/useAssetsStore';
import { useTransactionsStore } from '../../../src/store/useTransactionsStore';
import { IconButton } from '../../../src/components/ui/IconButton';
import { Card } from '../../../src/components/ui/Card';
import { Button } from '../../../src/components/ui/Button';
import { LinkAssetSheet } from '../../../src/components/goals/LinkAssetSheet';
import { formatCurrency } from '../../../src/utils/currency';
import { formatDate, getDaysUntil } from '../../../src/utils/date';
import { computeGoalProgress } from '../../../src/utils/calculations';

export default function GoalDetailScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const goals = useGoalsStore(s => s.goals);
  const links = useGoalsStore(s => s.links);
  const loadLinks = useGoalsStore(s => s.loadLinks);
  const removeGoal = useGoalsStore(s => s.remove);
  const addLink = useGoalsStore(s => s.addLink);
  const removeLink = useGoalsStore(s => s.removeLink);
  const assets = useAssetsStore(s => s.assets);
  const transactions = useTransactionsStore(s => s.transactions);
  const [sheetOpen, setSheetOpen] = useState(false);

  const goal = goals.find(g => String(g.id) === id);

  useEffect(() => {
    if (goal) loadLinks(goal.id);
  }, [goal?.id]);

  if (!goal) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: theme.colors.textSecondary }}>Goal not found</Text>
      </SafeAreaView>
    );
  }

  const goalLinks = links[goal.id] ?? [];
  const { saved, progress } = computeGoalProgress(goal, goalLinks, assets, transactions);
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const daysLeft = goal.deadline ? getDaysUntil(goal.deadline) : null;

  const size = 140;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  const linkedAssetIds = goalLinks.filter(l => l.link_type === 'ASSET' && l.asset_id).map(l => l.asset_id!);
  const linkedCategories = goalLinks.filter(l => l.link_type === 'TRANSACTION_CATEGORY' && l.category).map(l => l.category!);

  const handleDelete = () => {
    Alert.alert('Delete Goal', `Remove "${goal.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { removeGoal(goal.id); router.back(); } },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <View style={{
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
        paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border,
      }}>
        <IconButton name="arrow-back" onPress={() => router.back()} />
        <Text style={{ flex: 1, textAlign: 'center', fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.semibold, color: theme.colors.text }}>
          Goal Details
        </Text>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          <IconButton name="pencil-outline" onPress={() => router.push({ pathname: '/(tabs)/goals/add', params: { edit: String(goal.id) } })} />
          <IconButton name="trash-outline" onPress={handleDelete} color={theme.colors.danger} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Hero ring */}
        <LinearGradient
          colors={[goal.color ?? theme.colors.primary, theme.isDark ? '#1A1D2E' : '#F5F6FA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 20, marginBottom: 16, padding: 24, alignItems: 'center' }}
        >
          <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
              <Circle cx={size / 2} cy={size / 2} r={radius} stroke={'rgba(255,255,255,0.2)'} strokeWidth={strokeWidth} fill="none" />
              <Circle cx={size / 2} cy={size / 2} r={radius} stroke={'#fff'} strokeWidth={strokeWidth} fill="none"
                strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
            </Svg>
            <View style={{ position: 'absolute', alignItems: 'center' }}>
              <Text style={{ fontSize: 28 }}>{goal.icon}</Text>
              <Text style={{ fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold, color: '#fff' }}>
                {Math.round(clampedProgress)}%
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold, color: '#fff', marginBottom: 4 }}>
            {goal.name}
          </Text>
          <Text style={{ fontSize: theme.fontSize.md, color: 'rgba(255,255,255,0.8)' }}>
            {formatCurrency(saved)} saved of {formatCurrency(goal.target_amount)}
          </Text>
          {daysLeft !== null && (
            <Text style={{ fontSize: theme.fontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
              {daysLeft > 0 ? `${daysLeft} days remaining` : `Target date: ${formatDate(goal.deadline!)}`}
            </Text>
          )}
        </LinearGradient>

        {/* Linked items */}
        <Card style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold, color: theme.colors.text }}>
              Linked Sources
            </Text>
            <TouchableOpacity onPress={() => setSheetOpen(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: theme.fontSize.sm, color: theme.colors.primary, fontWeight: theme.fontWeight.medium }}>Manage</Text>
            </TouchableOpacity>
          </View>
          {goalLinks.length === 0 ? (
            <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSize.sm, textAlign: 'center', paddingVertical: 12 }}>
              No sources linked yet. Tap Manage to link assets or income categories.
            </Text>
          ) : (
            goalLinks.map(link => {
              if (link.link_type === 'ASSET') {
                const asset = assets.find(a => a.id === link.asset_id);
                return asset ? (
                  <View key={link.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
                    <Text style={{ flex: 1, color: theme.colors.text, fontSize: theme.fontSize.sm }}>{asset.name}</Text>
                    <Text style={{ color: theme.colors.primary, fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.semibold }}>
                      {formatCurrency(asset.current_value)}
                    </Text>
                  </View>
                ) : null;
              }
              if (link.link_type === 'TRANSACTION_CATEGORY') {
                return (
                  <View key={link.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
                    <Text style={{ flex: 1, color: theme.colors.text, fontSize: theme.fontSize.sm }}>Category: {link.category}</Text>
                  </View>
                );
              }
              return null;
            })
          )}
        </Card>

        {goal.notes ? (
          <Card style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: theme.fontSize.sm, color: theme.colors.textSecondary }}>{goal.notes}</Text>
          </Card>
        ) : null}
      </ScrollView>

      <LinkAssetSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        assets={assets}
        linkedAssetIds={linkedAssetIds}
        linkedCategories={linkedCategories}
        onLinkAsset={(assetId) => addLink({ goal_id: goal.id, link_type: 'ASSET', asset_id: assetId })}
        onUnlinkAsset={(assetId) => {
          const link = goalLinks.find(l => l.link_type === 'ASSET' && l.asset_id === assetId);
          if (link) removeLink(link.id, goal.id);
        }}
        onLinkCategory={(cat) => addLink({ goal_id: goal.id, link_type: 'TRANSACTION_CATEGORY', category: cat })}
        onUnlinkCategory={(cat) => {
          const link = goalLinks.find(l => l.link_type === 'TRANSACTION_CATEGORY' && l.category === cat);
          if (link) removeLink(link.id, goal.id);
        }}
      />
    </SafeAreaView>
  );
}




