import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Conditional SVG imports with fallbacks
let Svg: any, Path: any, Circle: any, Line: any, SvgText: any, Rect: any;

try {
  const SvgModule = require('react-native-svg');
  Svg = SvgModule.Svg || SvgModule.default || SvgModule;
  Path = SvgModule.Path;
  Circle = SvgModule.Circle;
  Line = SvgModule.Line;
  SvgText = SvgModule.Text;
  Rect = SvgModule.Rect;
} catch (e) {
  console.warn('React Native SVG not found, using fallback');
  // Fallback components
  Svg = ({ children, width, height, ...props }: any) => (
    <View 
      style={{ 
        backgroundColor: '#f5f5f5', 
        width: width || 300, 
        height: height || 200,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        ...props.style 
      }}
    >
      {children}
    </View>
  );
  Path = () => null;
  Circle = () => null;
  Line = () => null;
  SvgText = ({ children, ...props }: any) => (
    <Text style={{ fontSize: 10, color: '#666', position: 'absolute' }}>
      {children}
    </Text>
  );
  Rect = () => null;
}

// Type definitions
type RootStackParamList = {
  IndexLogin: undefined;
  VirtualPetLogin: undefined;
  RegisterScreen: undefined;
  NextRegisterScreen: undefined;
  ChoosePetScreen: undefined;
  LastRegisterScreen:undefined;
  HomeScreen: undefined;
  ReminderScreen: undefined;
  ProgressTrackerScreen: undefined;
  DailyHealthScreen: undefined;
  UserProfileScreen: undefined;
  GoalSettingScreen: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProgressTrackerScreen'
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

interface DataPoint {
  date: string;
  value: number;
  weight?: number;
  steps?: number;
  calories?: number;
  water?: number;
}

interface TabData {
  data: DataPoint[];
  goal: number;
  unit: string;
  goalLabel: string;
}

interface UserGoals {
  weight: number;
  steps: number;
  calories: number;
  water: number;
}

const { width: screenWidth } = Dimensions.get('window');

const ProgressTrackerScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<string>('体重');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('6ヶ月');
  
  // User goals state - in real app, this would come from global state/context
  const [userGoals, setUserGoals] = useState<UserGoals>({
    weight: 60,
    steps: 10000,
    calories: 2000,
    water: 2000
  });

  // Sample data with consistent structure
  const weightData: DataPoint[] = [
    { date: '2024-01', value: 73, weight: 73 },
    { date: '2024-02', value: 73, weight: 73 },
    { date: '2024-03', value: 72, weight: 72 },
    { date: '2024-04', value: 70, weight: 70 },
    { date: '2024-05', value: 65, weight: 65 },
    { date: '2024-06', value: 60, weight: 60 }
  ];

  const stepsData: DataPoint[] = [
    { date: '1', value: 8500, steps: 8500 },
    { date: '2', value: 9200, steps: 9200 },
    { date: '3', value: 3200, steps: 3200 },
    { date: '4', value: 7400, steps: 7400 },
    { date: '5', value: 6800, steps: 6800 },
    { date: '6', value: 4500, steps: 4500 },
    { date: '7', value: 3800, steps: 3800 },
    { date: '8', value: 5800, steps: 5800 },
    { date: '9', value: 2100, steps: 2100 },
    { date: '10', value: 11200, steps: 11200 },
    { date: '11', value: 4200, steps: 4200 },
    { date: '12', value: 9800, steps: 9800 }
  ];

  const calorieData: DataPoint[] = [
    { date: '1', value: 1800, calories: 1800 },
    { date: '2', value: 2100, calories: 2100 },
    { date: '3', value: 1400, calories: 1400 },
    { date: '4', value: 1900, calories: 1900 },
    { date: '5', value: 1700, calories: 1700 },
    { date: '6', value: 1600, calories: 1600 },
    { date: '7', value: 1500, calories: 1500 },
    { date: '8', value: 1750, calories: 1750 },
    { date: '9', value: 1200, calories: 1200 },
    { date: '10', value: 2300, calories: 2300 },
    { date: '11', value: 1550, calories: 1550 },
    { date: '12', value: 2050, calories: 2050 }
  ];

  const waterData: DataPoint[] = [
    { date: '1', value: 1800, water: 1800 },
    { date: '2', value: 2100, water: 2100 },
    { date: '3', value: 1200, water: 1200 },
    { date: '4', value: 1600, water: 1600 },
    { date: '5', value: 1400, water: 1400 },
    { date: '6', value: 1300, water: 1300 },
    { date: '7', value: 1100, water: 1100 },
    { date: '8', value: 1500, water: 1500 },
    { date: '9', value: 900, water: 900 },
    { date: '10', value: 2200, water: 2200 },
    { date: '11', value: 1250, water: 1250 },
    { date: '12', value: 1950, water: 1950 }
  ];

  const tabs: string[] = ['体重', '歩数', '摂取カロリー', '水分摂取量'];
  const periods: string[] = ['日', '週', '月', '6ヶ月', '年'];

  // Load user goals on mount (in real app, this would be from AsyncStorage or context)
  useEffect(() => {
    console.log('ProgressTrackerScreen mounted');
    console.log('Active tab:', activeTab);
    console.log('SVG available:', !!Svg);
    
    // Simulate loading user goals
    // In real implementation:
    // loadUserGoalsFromStorage().then(setUserGoals);
  }, [activeTab]);

  // Path creation for line charts
  const createPath = useCallback((data: DataPoint[]): string => {
    console.log('Creating path for data:', data?.length || 0, 'points');
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log('Invalid data, returning fallback path');
      return 'M 0,60 L 300,60';
    }

    try {
      const width = 280;
      const height = 120;
      
      // Get min and max values for scaling
      const values = data.map(item => item.weight || item.value || 0);
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);
      const range = maxValue - minValue || 1; // Avoid division by zero
      
      const points = data.map((item, index) => {
        const x = (index / Math.max(1, data.length - 1)) * width;
        const value = item.weight || item.value || 0;
        const normalizedValue = (value - minValue) / range;
        const y = height - (normalizedValue * height * 0.8) - height * 0.1; // Leave margins
        
        return `${Math.round(x)},${Math.round(Math.max(5, Math.min(height - 5, y)))}`;
      });

      const pathString = `M ${points.join(' L ')}`;
      console.log('Generated path successfully');
      return pathString;
      
    } catch (error) {
      console.error('Path creation error:', error);
      return 'M 0,60 L 300,60';
    }
  }, []);

  // Data getter with dynamic goals
  const getCurrentData = useCallback((): TabData => {
    console.log('Getting current data for tab:', activeTab);
    
    const dataMap: Record<string, TabData> = {
      '体重': { data: weightData, goal: userGoals.weight, unit: 'kg', goalLabel: '目標体重' },
      '歩数': { data: stepsData, goal: userGoals.steps, unit: '歩', goalLabel: '目標歩数' },
      '摂取カロリー': { data: calorieData, goal: userGoals.calories, unit: 'kcal', goalLabel: '目標カロリー' },
      '水分摂取量': { data: waterData, goal: userGoals.water, unit: 'ml', goalLabel: '目標水分量' }
    };

    return dataMap[activeTab] || dataMap['体重'];
  }, [activeTab, userGoals]);

  const currentData = getCurrentData();

  // Check if user has set goals (for UI feedback)
  const hasCustomGoals = () => {
    // In real app, check if goals have been customized from defaults
    return userGoals.weight !== 60 || userGoals.steps !== 10000 || 
           userGoals.calories !== 2000 || userGoals.water !== 2000;
  };

  // Weight chart rendering
  const renderWeightChart = () => {
    console.log('Rendering weight chart');
    
    return (
      <View style={styles.chartPlaceholder}>
        {Svg && typeof Svg === 'function' ? (
          <Svg width={screenWidth - 80} height={200} viewBox="0 0 300 150">
            <Path
              d={createPath(weightData)}
              fill="none"
              stroke="#4A90E2"
              strokeWidth="2"
            />
            
            {weightData.map((point, index) => {
              const x = (index / Math.max(1, weightData.length - 1)) * 280 + 10;
              const y = 120 - ((point.weight! - 55) / 20) * 100;
              
              return (
                <React.Fragment key={`weight-${index}`}>
                  <Circle cx={x} cy={Math.max(10, Math.min(140, y))} r="4" fill="#4A90E2" />
                  {index % 2 === 0 && (
                    <SvgText 
                      x={x} 
                      y={Math.max(25, Math.min(155, y + 15))} 
                      textAnchor="middle" 
                      fontSize="10" 
                      fill="#666"
                    >
                      {point.weight}kg
                    </SvgText>
                  )}
                </React.Fragment>
              );
            })}
            
            {/* Dynamic goal line */}
            <Line x1="10" y1="110" x2="290" y2="110" stroke="#ff4444" strokeWidth="2" strokeDasharray="5,5" />
            <SvgText x="250" y="105" fontSize="10" fill="#ff4444">
              目標 {userGoals.weight}kg
            </SvgText>
          </Svg>
        ) : (
          <View style={styles.fallbackChart}>
            <Text style={styles.fallbackText}>
              📊 体重チャート
              {'\n\n'}現在: {weightData[weightData.length - 1]?.weight || 0}kg
              {'\n'}目標: {userGoals.weight}kg
              {'\n\n'}推移: {weightData.map(d => `${d.weight}kg`).join(' → ')}
            </Text>
          </View>
        )}
      </View>
    );
  };

  // Bar chart rendering
  const renderBarChart = () => {
    console.log('Rendering bar chart for:', activeTab);
    
    const maxValue = Math.max(currentData.goal * 1.2, Math.max(...currentData.data.map(d => d.value)));
    const data = currentData.data || [];
    
    return (
      <View style={styles.chartPlaceholder}>
        {Svg && typeof Svg === 'function' ? (
          <Svg width={screenWidth - 80} height={200} viewBox="0 0 320 180">
            {/* Dynamic goal line */}
            <Line x1="20" y1="80" x2="300" y2="80" stroke="#ff4444" strokeWidth="2" strokeDasharray="3,3" />
            <SvgText x="250" y="75" fontSize="10" fill="#ff4444">
              目標 {currentData.goal}{currentData.unit}
            </SvgText>
            
            {/* Bars */}
            {data.slice(0, 12).map((item, index) => {
              const barWidth = 18;
              const x = 25 + (index * 22);
              
              const value = item.value || item.steps || item.calories || item.water || 0;
              const barHeight = Math.max(5, (value / maxValue) * 120);
              const y = 160 - barHeight;
              
              return (
                <React.Fragment key={`bar-${index}`}>
                  <Rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={value >= currentData.goal ? "#4CAF50" : "#E0E0E0"}
                    rx="2"
                  />
                  {index % 3 === 0 && (
                    <SvgText 
                      x={x + barWidth/2} 
                      y="175" 
                      textAnchor="middle" 
                      fontSize="8" 
                      fill="#999"
                    >
                      {item.date}
                    </SvgText>
                  )}
                </React.Fragment>
              );
            })}
          </Svg>
        ) : (
          <View style={styles.fallbackChart}>
            <Text style={styles.fallbackText}>
              📊 {activeTab}チャート
              {'\n\n'}目標: {currentData.goal}{currentData.unit}
              {'\n'}平均: {Math.round(data.reduce((sum, item) => sum + (item.value || 0), 0) / data.length || 0)}{currentData.unit}
              {'\n\n'}データポイント: {data.length}個
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f4ff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>健康データ</Text>
        <TouchableOpacity 
          style={styles.goalButton} 
          onPress={() => navigation.navigate('GoalSettingScreen')}
        >
          <Ionicons name="settings-outline" size={20} color="#4A90E2" />
          <Text style={styles.goalButtonText}>目標</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Goal Status Banner */}
        {!hasCustomGoals() && (
          <TouchableOpacity 
            style={styles.goalBanner}
            onPress={() => navigation.navigate('GoalSettingScreen')}
            >
            <View style={styles.goalBannerContent}>
              <Ionicons name="flag-outline" size={20} color="#ff9500" />
              <View style={styles.goalBannerText}>
                <Text style={styles.goalBannerTitle}>目標を設定しましょう</Text>
                <Text style={styles.goalBannerSubtitle}>
                  自分に合った健康目標を設定して、より正確な進捗を追跡できます
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ff9500" />
            </View>
          </TouchableOpacity>
        )}

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => {
                console.log('Tab pressed:', tab);
                setActiveTab(tab);
              }}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Period Selection */}
        <View style={styles.periodContainer}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period}
              onPress={() => {
                console.log('Period selected:', period);
                setSelectedPeriod(period);
              }}
              style={styles.periodButton}
            >
              <Text style={[styles.periodText, selectedPeriod === period && styles.activePeriodText]}>
                {period}
              </Text>
              {selectedPeriod === period && <View style={styles.periodUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart Area */}
        <View style={styles.chartContainer}>
          {activeTab === '体重' ? renderWeightChart() : renderBarChart()}
        </View>

        {/* Current Value and Goal Display */}
        <View style={styles.statsContainer}>
          <View style={styles.currentValueContainer}>
            <Text style={styles.currentValueLabel}>現在の値</Text>
            <Text style={styles.currentValue}>
              {currentData.data && currentData.data.length > 0 
                ? `${currentData.data[currentData.data.length - 1].value || 0}${currentData.unit}`
                : `0${currentData.unit}`
              }
            </Text>
          </View>
          
          <View style={styles.goalValueContainer}>
            <Text style={styles.goalValueLabel}>目標値</Text>
            <Text style={styles.goalValue}>{currentData.goal}{currentData.unit}</Text>
            
            {/* Progress indicator */}
            {currentData.data && currentData.data.length > 0 && (
              <View style={styles.progressContainer}>
                {(() => {
                  const currentValue = currentData.data[currentData.data.length - 1].value || 0;
                  const progress = activeTab === '体重' 
                    ? Math.abs(currentValue - currentData.goal) / currentData.goal * 100
                    : (currentValue / currentData.goal) * 100;
                  const isOnTrack = activeTab === '体重' 
                    ? Math.abs(currentValue - currentData.goal) <= currentData.goal * 0.05
                    : currentValue >= currentData.goal * 0.8;
                  
                  return (
                    <Text style={[styles.progressText, isOnTrack && styles.progressTextGood]}>
                      {activeTab === '体重' 
                        ? `目標まであと${Math.abs(currentValue - currentData.goal).toFixed(1)}${currentData.unit}`
                        : `達成率 ${Math.min(100, progress).toFixed(0)}%`
                      }
                    </Text>
                  );
                })()}
              </View>
            )}
          </View>
        </View>

        {/* Period Label */}
        <Text style={styles.periodLabel}>表示期間: {selectedPeriod}</Text>
      </ScrollView>

      yang bagian ini nya juga bukan hanya homescreen nya yang berwarna ini #8B7CF6 tetapi saat di tekan yang lainnya warna itu yang akan berubah      {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('ReminderScreen')}
              >
                <Ionicons name="time-outline" size={24} color="#666" />
              </TouchableOpacity>
           
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('ProgressTrackerScreen')}
              >
                <Ionicons name="stats-chart-outline" size={24} color="#666" />
              </TouchableOpacity>
           
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('HomeScreen')}
              >
                <Ionicons name="home" size={24} color="#8B7CF6" />
              </TouchableOpacity>
           
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('DailyHealthScreen')}
              >
                <Ionicons name="create-outline" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('UserProfileScreen')}
              >
                <Ionicons name="person-outline" size={24} color="#666" />
              </TouchableOpacity>
            </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f4ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  goalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  goalButtonText: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '500',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  goalBanner: {
    backgroundColor: '#fff3e0',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  goalBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalBannerText: {
    flex: 1,
    marginHorizontal: 12,
  },
  goalBannerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e65100',
    marginBottom: 2,
  },
  goalBannerSubtitle: {
    fontSize: 12,
    color: '#bf360c',
    lineHeight: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#f0f0f0',
  },
  tabText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#333',
  },
  periodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  periodText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  activePeriodText: {
    color: '#333',
  },
  periodUnderline: {
    height: 2,
    backgroundColor: '#4A90E2',
    marginTop: 4,
    width: '100%',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    minHeight: 250,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartPlaceholder: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackChart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 20,
  },
  fallbackText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  currentValueContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginRight: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  goalValueContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginLeft: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  currentValueLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  goalValueLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  currentValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  goalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressText: {
    fontSize: 11,
    color: '#ff6b6b',
    textAlign: 'center',
  },
  progressTextGood: {
    color: '#4CAF50',
  },
  periodLabel: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
    marginBottom: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    padding: 8,
  },
});

export default ProgressTrackerScreen;