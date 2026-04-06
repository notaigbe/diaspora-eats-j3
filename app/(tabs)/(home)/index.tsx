
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { colors, typography, textStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { DiasporaSegment } from '@/types/database.types';
import { MOCK_VENDORS } from '@/constants/MockVendorData';
import { MOCK_EVENTS } from '@/constants/MockEventData';

const { width } = Dimensions.get('window');
const CAROUSEL_WIDTH = width - 40;

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Hero carousel images
  const heroImages = [
    {
      id: '1',
      city: 'NYC',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
    },
    {
      id: '2',
      city: 'LA',
      image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800',
    },
    {
      id: '3',
      city: 'Miami',
      image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800',
    },
  ];

  const categories = ['All', 'Jambalaya', 'Jerk', 'Jollof'];

  // Featured vendors
  const featuredVendors = [...MOCK_VENDORS]
    .sort((a, b) => b.rating_average - a.rating_average)
    .slice(0, 4);

  // Nearby grocery
  const groceryVendors = MOCK_VENDORS.filter((v) => v.vendor_type === 'grocery').slice(0, 3);

  // Upcoming events
  const now = new Date();
  const upcomingEvents = MOCK_EVENTS.filter((event) => {
    const eventDate = new Date(event.start_datetime);
    return eventDate >= now && event.is_published;
  })
    .sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime())
    .slice(0, 3);

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Carousel */}
        <View style={styles.heroSection}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
          >
            {heroImages.map((item, index) => (
              <React.Fragment key={index}>
                <View style={styles.carouselItem}>
                  <Image source={{ uri: item.image }} style={styles.heroImage} />
                  <LinearGradient
                    colors={['transparent', 'rgba(13, 13, 13, 0.9)']}
                    style={styles.heroGradient}
                  >
                    <Text style={styles.heroCity}>{item.city}</Text>
                    <Text style={styles.heroSubtext}>Discover Diaspora Flavors</Text>
                  </LinearGradient>
                </View>
              </React.Fragment>
            ))}
          </ScrollView>
        </View>

        {/* Category Chips */}
        <View style={styles.categorySection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {categories.map((category, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    selectedCategory === category && styles.categoryChipActive,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category && styles.categoryTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </ScrollView>
        </View>

        {/* Featured Restaurants */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Restaurants</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {featuredVendors.map((vendor, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity
                style={styles.restaurantCard}
                onPress={() => router.push(`/vendor/${vendor.id}`)}
                activeOpacity={0.9}
              >
                <Image source={{ uri: vendor.cover_image }} style={styles.restaurantImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(13, 13, 13, 0.95)']}
                  style={styles.restaurantGradient}
                >
                  <View style={styles.restaurantInfo}>
                    <Text style={styles.restaurantName}>{vendor.name}</Text>
                    <Text style={styles.restaurantTagline}>{vendor.tagline}</Text>
                    <View style={styles.restaurantMeta}>
                      <View style={styles.ratingBadge}>
                        <IconSymbol
                          ios_icon_name="star.fill"
                          android_material_icon_name="star"
                          size={14}
                          color={colors.gold}
                        />
                        <Text style={styles.ratingText}>{vendor.rating_average}</Text>
                      </View>
                      <View style={styles.cuisineBadges}>
                        {vendor.diaspora_focus.slice(0, 2).map((focus, idx) => (
                          <React.Fragment key={idx}>
                            <View style={styles.cuisineBadge}>
                              <Text style={styles.cuisineBadgeText}>{focus}</Text>
                            </View>
                          </React.Fragment>
                        ))}
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>

        {/* Grocery Near You */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Grocery Near You</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {groceryVendors.map((vendor, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={styles.groceryCard}
                  onPress={() => router.push(`/vendor/${vendor.id}`)}
                  activeOpacity={0.9}
                >
                  <Image source={{ uri: vendor.cover_image }} style={styles.groceryImage} />
                  <View style={styles.groceryInfo}>
                    <Text style={styles.groceryName} numberOfLines={1}>
                      {vendor.name}
                    </Text>
                    <Text style={styles.groceryTagline} numberOfLines={1}>
                      {vendor.tagline}
                    </Text>
                    <View style={styles.groceryBadge}>
                      <IconSymbol
                        ios_icon_name="cart.fill"
                        android_material_icon_name="shopping-cart"
                        size={12}
                        color={colors.gold}
                      />
                      <Text style={styles.groceryBadgeText}>Grocery</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </ScrollView>
        </View>

        {/* Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/events')}>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {upcomingEvents.map((event, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity
                style={styles.eventCard}
                onPress={() => router.push(`/event-detail?id=${event.id}`)}
                activeOpacity={0.9}
              >
                <Image source={{ uri: event.hero_image }} style={styles.eventImage} />
                <LinearGradient
                  colors={[colors.red, colors.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.eventDateBadge}
                >
                  <Text style={styles.eventDate}>{formatEventDate(event.start_datetime)}</Text>
                </LinearGradient>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle} numberOfLines={2}>
                    {event.title}
                  </Text>
                  <Text style={styles.eventSubtitle} numberOfLines={1}>
                    {event.subtitle}
                  </Text>
                  <View style={styles.eventMeta}>
                    <IconSymbol
                      ios_icon_name="location.fill"
                      android_material_icon_name="location-on"
                      size={14}
                      color={colors.gold}
                    />
                    <Text style={styles.eventLocation}>
                      {event.city}, {event.state}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  scrollContent: {
    paddingTop: 60,
  },
  heroSection: {
    marginBottom: 24,
  },
  carouselContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  carouselItem: {
    width: CAROUSEL_WIDTH,
    height: 240,
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  heroCity: {
    // Using Montserrat ExtraBold for strong, impactful headlines
    ...typography.h1,
    fontSize: 32,
    color: colors.gold,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtext: {
    // Using Poppins Medium for smooth UI labels
    ...typography.label,
    fontSize: 14,
    color: colors.text,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryChip: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  categoryText: {
    // Using Poppins SemiBold for category labels
    ...typography.labelLarge,
    fontWeight: '700',
  },
  categoryTextActive: {
    color: '#0D0D0D',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    // Using Poppins SemiBold for section titles
    ...typography.h3,
    fontSize: 22,
  },
  seeAll: {
    // Using Poppins Medium for action labels
    ...typography.labelSmall,
    fontSize: 14,
    color: colors.gold,
    textTransform: 'uppercase',
  },
  restaurantCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '0px 8px 24px rgba(212, 175, 55, 0.2)',
    elevation: 8,
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
  },
  restaurantGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    justifyContent: 'flex-end',
  },
  restaurantInfo: {
    padding: 20,
  },
  restaurantName: {
    // Using Poppins SemiBold for restaurant names
    ...typography.h4,
    fontSize: 20,
    marginBottom: 4,
  },
  restaurantTagline: {
    // Using Poppins Regular for body text
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingText: {
    // Using Poppins SemiBold for ratings
    ...typography.labelSmall,
    fontSize: 14,
    color: colors.gold,
  },
  cuisineBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  cuisineBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cuisineBadgeText: {
    // Using Poppins Light for subtle captions
    ...typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    gap: 16,
  },
  groceryCard: {
    width: 180,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.card,
    boxShadow: '0px 4px 16px rgba(212, 175, 55, 0.15)',
    elevation: 4,
  },
  groceryImage: {
    width: '100%',
    height: 120,
  },
  groceryInfo: {
    padding: 12,
  },
  groceryName: {
    // Using Poppins Medium for grocery names
    ...typography.h6,
    fontSize: 15,
    marginBottom: 4,
  },
  groceryTagline: {
    // Using Poppins Light for captions
    ...typography.caption,
    fontSize: 12,
    marginBottom: 8,
  },
  groceryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  groceryBadgeText: {
    // Using Poppins Medium for badge text
    ...typography.labelSmall,
    fontSize: 11,
    color: colors.gold,
  },
  eventCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.card,
    boxShadow: '0px 8px 24px rgba(196, 30, 58, 0.2)',
    elevation: 8,
  },
  eventImage: {
    width: '100%',
    height: 160,
  },
  eventDateBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
  },
  eventDate: {
    // Using Poppins SemiBold for event dates
    ...typography.labelSmall,
    fontSize: 13,
    color: '#FFFFFF',
  },
  eventInfo: {
    padding: 16,
  },
  eventTitle: {
    // Using Poppins SemiBold for event titles
    ...typography.h5,
    fontSize: 18,
    marginBottom: 4,
  },
  eventSubtitle: {
    // Using Poppins Regular for event subtitles
    ...typography.bodySmall,
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventLocation: {
    // Using Poppins Medium for location labels
    ...typography.label,
    fontSize: 13,
    color: colors.gold,
  },
  bottomPadding: {
    height: 120,
  },
});
