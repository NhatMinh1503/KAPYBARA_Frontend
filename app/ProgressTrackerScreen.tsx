import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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

const ProgressTrackerScreen: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('体重');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('6ヶ月');
  
  // User goals state - in real app, this would come from global state/context
  const [userGoals, setUserGoals] = useState<UserGoals>({
    weight: 60,
    steps: 6000,
    calories: 2000,
    water: 2000
  });

  const goalsData = async () => {
    const user_id = await AsyncStorage.getItem('user_id');
    try{
      const response = await fetch(`http://10.108.1.0:3000/goals/${user_id}`);
      if(response.ok){
        const data = await response.json();
        setUserGoals(data);
      }
    }catch(err){
      console.log('Failed to fetch data!', err);
    }
  }

  // API data with consistent structure
  const [caloriesDataFromAPI, setCaloriesDataFromAPI] = useState<DataPoint[]>([]);
  const [waterDataFromAPI, setWaterDataFromAPI] = useState<DataPoint[]>([]);
  const [stepsDataFromAPI, setStepsDataFromAPI] = useState<DataPoint[]>([]);
  const [weightDataFromAPI, setWeightDataFromAPI] = useState<DataPoint[]>([]);

  const periodMap: Record<string, string> = {
  '日': 'day',
  '週': 'week',
  '月': 'month',
  '6ヶ月': '6months',
  '年': 'year',
};

  const tabs: string[] = ['体重', '歩数', '摂取カロリー', '水分摂取量'];
  const periods: string[] = Object.keys(periodMap);

  // Load user goals on mount (in real app, this would be from AsyncStorage or context)
  useEffect(() => {
  if (activeTab === '水分摂取量') {
    const fetchWaterData = async () => {
      try {
        const user_id = await AsyncStorage.getItem('user_id'); // 🔁 thay bằng user thực tế
        const mode = periodMap[selectedPeriod] || 'month'; // hoặc từ selectedPeriod

        const response = await fetch(`http://10.108.1.0:3000/water_data/${mode}?user_id=${user_id}`);
        const json = await response.json();

        // Trường hợp API trả về dạng { labels: [...], data: [...] }
        const formatted = json.labels.map((label: string, index: number) => ({
          date: label,
          value: json.data[index],
          water: json.data[index] // 👈 thêm trường `water` để dùng trong biểu đồ
        }));

        setWaterDataFromAPI(formatted);
      } catch (error) {
        console.error('Failed to fetch water data:', error);
      }
    };

    fetchWaterData();
  }
}, [activeTab, selectedPeriod]);


  useEffect(() => {
  if (activeTab === '摂取カロリー') {
    const fetchCalorieData = async () => {
      try {
        const user_id = await AsyncStorage.getItem('user_id'); // thay bằng id thật
        const mode = periodMap[selectedPeriod] || 'month'; // hoặc selectedPeriod tương ứng

        const response = await fetch(`http://10.108.1.0:3000/calories_data/${mode}?user_id=${user_id}`);
        const json = await response.json();

        const formatted = json.labels.map((label: string, index: number) => ({
          date: label,
          value: json.data[index],
          calories: json.data[index], // thêm trường calories để dùng trong biểu đồ
        }));

        setCaloriesDataFromAPI(formatted);
      } catch (error) {
        console.error('Failed to fetch calorie data:', error);
      }
    };

    fetchCalorieData();
  }
}, [activeTab, selectedPeriod]);


  useEffect(() => {
  if (activeTab === '歩数') {
    const fetchStepsData = async () => {
      try {
        const user_id = await AsyncStorage.getItem('user_id'); // thay bằng id thật
        const mode = periodMap[selectedPeriod] || 'month'; // ví dụ 'month', 'week', etc.

        const response = await fetch(`http://10.108.1.0:3000/steps_data/${mode}?user_id=${user_id}`);
        const json = await response.json();

        const formatted = json.labels.map((label: string, index: number) => ({
          date: label,
          value: json.data[index],
          steps: json.data[index], // thêm trường steps để vẽ biểu đồ
        }));

        setStepsDataFromAPI(formatted);
      } catch (error) {
        console.error('Failed to fetch steps data:', error);
      }
    };

    fetchStepsData();
  }
}, [activeTab, selectedPeriod]);


  useEffect(() => {
  if (activeTab === '体重') {
    const fetchWeightData = async () => {
      try {
        const user_id = await AsyncStorage.getItem('user_id'); // Thay bằng user id thực tế
        const mode = periodMap[selectedPeriod] || 'month'; // '日', '週', '月', '6ヶ月', '年' có thể map thành 'day', 'week', 'month', '6months', 'year' tùy backend

        const response = await fetch(`http://10.108.1.0:3000/weight_data/${mode}?user_id=${user_id}`);
        const json = await response.json();

        const formatted = json.labels.map((label: string, index: number) => ({
          date: label,
          value: json.data[index],
          weight: json.data[index], // thêm trường weight để biểu đồ weight sử dụng
        }));

        setWeightDataFromAPI(formatted);
      } catch (error) {
        console.error('Failed to fetch weight data:', error);
      }
    };

    fetchWeightData();
  }
}, [activeTab, selectedPeriod]);


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
  const dataMap: Record<string, TabData> = {
    '体重': { 
      data: weightDataFromAPI, 
      goal: userGoals.weight, 
      unit: 'kg', 
      goalLabel: '目標体重' },
    '歩数': { 
      data: stepsDataFromAPI, 
      goal: userGoals.steps, 
      unit: '歩', 
      goalLabel: '目標歩数' },
    '摂取カロリー': {
      data: caloriesDataFromAPI,
      goal: userGoals.calories,
      unit: 'kcal',
      goalLabel: '目標カロリー'
      },
    '水分摂取量': {
      data: waterDataFromAPI,
      goal: userGoals.water,
      unit: 'ml',
      goalLabel: '目標水分量'
}
  };

  return dataMap[activeTab] || dataMap['体重'];
}, [activeTab, userGoals, weightDataFromAPI, stepsDataFromAPI, caloriesDataFromAPI, waterDataFromAPI]);


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
              d={createPath(weightDataFromAPI)}
              fill="none"
              stroke="#4A90E2"
              strokeWidth="2"
            />
            
            {weightDataFromAPI.map((point, index) => {
              const x = (index / Math.max(1, weightDataFromAPI.length - 1)) * 280 + 10;
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
              {'\n\n'}現在: {weightDataFromAPI[weightDataFromAPI.length - 1]?.weight || 0}kg
              {'\n'}目標: {userGoals.weight}kg
              {'\n\n'}推移: {weightDataFromAPI.map(d => `${d.weight}kg`).join(' → ')}
            </Text>
          </View>
        )}
      </View>
    );
  };

  

 // Bar chart rendering - Updated version with more prominent goal line
  const renderBarChart = () => {
    console.log('Rendering bar chart for:', activeTab);
    
    const maxValue = Math.max(currentData.goal * 1.2, Math.max(...currentData.data.map(d => d.value)));
    const data = currentData.data || [];
    
    return (
      <View style={styles.chartPlaceholder}>
        {Svg && typeof Svg === 'function' ? (
          <Svg width={screenWidth - 80} height={200} viewBox="0 0 320 180">
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
            
            {/* Dynamic goal line - More prominent like weight chart */}
            {(() => {
              const goalY = 160 - ((currentData.goal / maxValue) * 120);
              const clampedGoalY = Math.max(20, Math.min(150, goalY));
              
              return (
                <React.Fragment>
                  <Line 
                    x1="20" 
                    y1={clampedGoalY} 
                    x2="300" 
                    y2={clampedGoalY} 
                    stroke="#ff4444" 
                    strokeWidth="2" 
                    strokeDasharray="5,5" 
                  />
                  <SvgText 
                    x="250" 
                    y={clampedGoalY - 5} 
                    fontSize="11" 
                    fill="#ff4444"
                    fontWeight="bold"
                  >
                    目標 {currentData.goal.toLocaleString()}{currentData.unit}
                  </SvgText>
                </React.Fragment>
              );
            })()}
          </Svg>
        ) : (
          <View style={styles.fallbackChart}>
            <Text style={styles.fallbackText}>
              📊 {activeTab}チャート
              {'\n\n'}目標: {currentData.goal.toLocaleString()}{currentData.unit}
              {'\n'}平均: {Math.round(data.reduce((sum, item) => sum + (item.value || 0), 0) / data.length || 0).toLocaleString()}{currentData.unit}
              {'\n\n'}データポイント: {data.length}個
            </Text>
          </View>
        )}
      </View>
    );
  };
  
  const getCurrentRouteName = () => {
    try {
      const pathname = usePathname();
      const segments = pathname.split('/');
      return segments[segments.length - 1] || '';
    } catch (error) {
      console.error('Error getting current route name:', error);
      return '';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f4ff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>健康データ</Text>
        <TouchableOpacity 
          style={styles.goalButton} 
          onPress={() => router.push('/GoalSettingScreen')}
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
            onPress={() => router.push('/GoalSettingScreen')}
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

 {/* Bottom Navigation - FIXED: All buttons with proper color logic */}
            <View style={styles.bottomNav}>
              <TouchableOpacity
                style={[
                  styles.navItem,
                  getCurrentRouteName() === 'ReminderScreen' && styles.activeNavItem
                ]}
                onPress={() => router.push('/ReminderScreen')}
              >
                <Ionicons 
                  name="time-outline" 
                  size={24} 
                  color={getCurrentRouteName() === 'ReminderScreen' ? "#8B7CF6" : "#666"} 
                />
              </TouchableOpacity>
      
              <TouchableOpacity
                style={[
                  styles.navItem,
                  getCurrentRouteName() === 'ProgressTrackerScreen' && styles.activeNavItem
                ]}
                onPress={() => router.push('/ProgressTrackerScreen')}
              >
                <Ionicons 
                  name="stats-chart-outline" 
                  size={24} 
                  color={getCurrentRouteName() === 'ProgressTrackerScreen' ? "#8B7CF6" : "#666"} 
                />
              </TouchableOpacity>
      
              <TouchableOpacity
                style={[
                  styles.navItem,
                  getCurrentRouteName() === 'HomeScreen' && styles.activeNavItem
                ]}
                onPress={() => router.push('/HomeScreen')}
              >
                <Ionicons 
                  name="home" 
                  size={24} 
                  color={getCurrentRouteName() === 'HomeScreen' ? "#8B7CF6" : "#666"} 
                />
              </TouchableOpacity>
      
              <TouchableOpacity
                style={[
                  styles.navItem,
                  getCurrentRouteName() === 'DailyHealthScreen' && styles.activeNavItem
                ]}
                onPress={() => router.push('/DailyHealthScreen')}
              >
                <Ionicons 
                  name="create-outline" 
                  size={24} 
                  color={getCurrentRouteName() === 'DailyHealthScreen' ? "#8B7CF6" : "#666"} 
                />
              </TouchableOpacity>
      
              <TouchableOpacity
                style={[
                  styles.navItem,
                  getCurrentRouteName() === 'UserProfileScreen' && styles.activeNavItem
                ]}
                onPress={() => router.push('/UserProfileScreen')}
              >
                <Ionicons 
                  name="person-outline" 
                  size={24} 
                  color={getCurrentRouteName() === 'UserProfileScreen' ? "#8B7CF6" : "#666"} 
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
  );
};



const styles = StyleSheet.create({
   activeNavItem: {
    opacity: 1,
  },

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