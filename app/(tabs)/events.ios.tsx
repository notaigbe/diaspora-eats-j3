
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { DiasporaSegment, EventType } from '@/types/database.types';
import { MOCK_EVENTS } from '@/constants/MockEventData';
import { US_STATES, MAJOR_CITIES_BY_STATE } from '@/constants/LocationData';

type DateFilter = 'All' | 'Today' | 'This Weekend' | 'Next 7 Days' | 'Next 30 Days';

export default function EventsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.dark;
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>(user?.default_location_state || 'All');
  const [selectedCity, setSelectedCity] = useState<string>(user?.default_location_city || 'All');
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>([]);
  const [selectedDiaspora, setSelectedDiaspora] = useState<DiasporaSegment[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilter>('All');
  const [showFilters, setShowFilters] = useState(false);

  const bgColor = isDark ? colors.backgroundDark : colors.background;
  const textColor = isDark ? colors.textDark : colors.text;
  const textSecondaryColor = isDark ? colors.textSecondaryDark : colors.textSecondary;
  const cardColor = isDark ? colors.cardDark : colors.card;

  const eventTypes: EventType[] = [
    'Brunch',
    'Festival',
    'Pop-up',
    'Market',
    'Tasting',
    'Party',
    'Meetup',
  ];

  const diasporaSegments: DiasporaSegment[] = [
    'African American',
    'Caribbean',
    'African',
    'Pan-African',
  ];

  const dateFilters: DateFilter[] = [
    'All',
    'Today',
    'This Weekend',
    'Next 7 Days',
    'Next 30 Days',
  ];

  const toggleEventType = (type: EventType) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const toggleDiaspora = (segment: DiasporaSegment) => {
    if (selectedDiaspora.includes(segment)) {
      setSelectedDiaspora(selectedDiaspora.filter((s) => s !== segment));
    } else {
      setSelectedDiaspora([...selectedDiaspora, segment]);
    }
  };

  const getDateRange = (filter: DateFilter): { start: Date; end: Date } | null => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (filter) {
      case 'Today':
        return {
          start: today,
          end: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        };
      case 'This Weekend': {
        const dayOfWeek = now.getDay();
        const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
        const saturday = new Date(today.getTime() + daysUntilSaturday * 24 * 60 * 60 * 1000);
        const monday = new Date(saturday.getTime() + 3 * 24 * 60 * 60 * 1000);
        return { start: saturday, end: monday };
      }
      case 'Next 7 Days':
        return {
          start: today,
          end: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
        };
      case 'Next 30 Days':
        return {
          start: today,
          end: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
        };
      default:
        return null;
    }
  };

  // Filter events
  const now = new Date();
  const filteredEvents = MOCK_EVENTS.filter((event) => {
    const eventDate = new Date(event.start_datetime);
    const isUpcoming = eventDate >= now;
    const isPublished = event.is_published;

    // Search filter
    const matchesSearch =
      searchQuery === '' ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.event_type.toLowerCase().includes(searchQuery.toLowerCase());

    // State filter
    const matchesState = selectedState === 'All' || event.state === selectedState;

    // City filter
    const matchesCity = selectedCity === 'All' || event.city === selectedCity;

    // Event type filter
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(event.event_type);

    // Diaspora filter
    const matchesDiaspora =
      selectedDiaspora.length === 0 ||
      event.diaspora_focus.some((focus) => selectedDiaspora.includes(focus));

    // Date filter
    let matchesDate = true;
    if (dateFilter !== 'All') {
      const range = getDateRange(dateFilter);
      if (range) {
        matchesDate = eventDate >= range.start && eventDate < range.end;
      }
    }

    return (
      isUpcoming &&
      isPublished &&
      matchesSearch &&
      matchesState &&
      matchesCity &&
      matchesType &&
      matchesDiaspora &&
      matchesDate
    );
  }).sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime());

  const featuredEvents = filteredEvents.filter((e) => e.is_featured);

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedState(user?.default_location_state || 'All');
    setSelectedCity(user?.default_location_city || 'All');
    setSelectedTypes([]);
    setSelectedDiaspora([]);
    setDateFilter('All');
  };

  const activeFiltersCount =
    (selectedState !== 'All' ? 1 : 0) +
    (selectedCity !== 'All' ? 1 : 0) +
    selectedTypes.length +
    selectedDiaspora.length +
    (dateFilter !== 'All' ? 1 : 0);

  const EventCard = ({ event, featured = false }: any) => (
    <TouchableOpacity
      style={[
        featured ? styles.featuredCard : styles.eventCard,
        { backgroundColor: cardColor },
      ]}
      onPress={() => router.push(`/event-detail?id=${event.id}`)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: event.hero_image }}
        style={featured ? styles.featuredImage : styles.eventImage}
      />
      {featured && (
        <View style={styles.featuredBadge}>
          <IconSymbol
            ios_icon_name="star.fill"
            android_material_icon_name="star"
            size={12}
            color="#FFFFFF"
          />
          <Text style={styles.featuredBadgeText}>Featured</Text>
        </View>
      )}
      <View style={styles.eventInfo}>
        <Text style={[styles.eventTitle, { color: textColor }]} numberOfLines={2}>
          {event.title}
        </Text>
        {event.subtitle && (
          <Text style={[styles.eventSubtitle, { color: textSecondaryColor }]} numberOfLines={1}>
            {event.subtitle}
          </Text>
        )}
        <View style={styles.eventMeta}>
          <View style={styles.metaRow}>
            <IconSymbol
              ios_icon_name="calendar"
              android_material_icon_name="event"
              size={14}
              color={colors.primary}
            />
            <Text style={[styles.metaText, { color: textSecondaryColor }]}>
              {formatEventDate(event.start_datetime)}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <IconSymbol
              ios_icon_name="location.fill"
              android_material_icon_name="location_on"
              size={14}
              color={colors.primary}
            />
            <Text style={[styles.metaText, { color: textSecondaryColor }]}>
              {event.city}, {event.state}
            </Text>
          </View>
        </View>
        <View style={styles.badges}>
          <View style={[styles.typeBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.typeBadgeText}>{event.event_type}</Text>
          </View>
          {event.diaspora_focus.slice(0, 2).map((focus, index) => (
            <React.Fragment key={index}>
              <View style={[styles.badge, { backgroundColor: colors.highlight }]}>
                <Text style={[styles.badgeText, { color: colors.text }]}>
                  {focus}
                </Text>
              </View>
            </React.Fragment>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const citiesForState = selectedState !== 'All' ? MAJOR_CITIES_BY_STATE[selectedState] || [] : [];

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.pageTitle, { color: textColor }]}>
            Events & Socials
          </Text>
          <Text style={[styles.pageSubtitle, { color: textSecondaryColor }]}>
            Discover diaspora food events near you
          </Text>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: cardColor }]}>
          <IconSymbol
            ios_icon_name="magnifyingglass"
            android_material_icon_name="search"
            size={20}
            color={textSecondaryColor}
          />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search by title, city, or type..."
            placeholderTextColor={textSecondaryColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <IconSymbol
                ios_icon_name="xmark.circle.fill"
                android_material_icon_name="cancel"
                size={20}
                color={textSecondaryColor}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Button */}
        <View style={styles.filterButtonRow}>
          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: cardColor }]}
            onPress={() => setShowFilters(true)}
            activeOpacity={0.7}
          >
            <IconSymbol
              ios_icon_name="slider.horizontal.3"
              android_material_icon_name="tune"
              size={20}
              color={colors.primary}
            />
            <Text style={[styles.filterButtonText, { color: textColor }]}>
              Filters
            </Text>
            {activeFiltersCount > 0 && (
              <View style={[styles.filterBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          {activeFiltersCount > 0 && (
            <TouchableOpacity
              style={[styles.clearButton, { backgroundColor: cardColor }]}
              onPress={clearFilters}
              activeOpacity={0.7}
            >
              <Text style={[styles.clearButtonText, { color: colors.primary }]}>
                Clear All
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.activeFiltersScroll}
            contentContainerStyle={styles.activeFiltersContent}
          >
            {selectedState !== 'All' && (
              <View style={[styles.activeFilterChip, { backgroundColor: colors.primary }]}>
                <Text style={styles.activeFilterText}>State: {selectedState}</Text>
              </View>
            )}
            {selectedCity !== 'All' && (
              <View style={[styles.activeFilterChip, { backgroundColor: colors.primary }]}>
                <Text style={styles.activeFilterText}>City: {selectedCity}</Text>
              </View>
            )}
            {selectedTypes.map((type, index) => (
              <React.Fragment key={index}>
                <View style={[styles.activeFilterChip, { backgroundColor: colors.primary }]}>
                  <Text style={styles.activeFilterText}>{type}</Text>
                </View>
              </React.Fragment>
            ))}
            {selectedDiaspora.map((segment, index) => (
              <React.Fragment key={index}>
                <View style={[styles.activeFilterChip, { backgroundColor: colors.primary }]}>
                  <Text style={styles.activeFilterText}>{segment}</Text>
                </View>
              </React.Fragment>
            ))}
            {dateFilter !== 'All' && (
              <View style={[styles.activeFilterChip, { backgroundColor: colors.primary }]}>
                <Text style={styles.activeFilterText}>{dateFilter}</Text>
              </View>
            )}
          </ScrollView>
        )}

        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Featured Events
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {featuredEvents.map((event, index) => (
                <React.Fragment key={index}>
                  <EventCard event={event} featured />
                </React.Fragment>
              ))}
            </ScrollView>
          </View>
        )}

        {/* All Upcoming Events */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Upcoming Events ({filteredEvents.length})
          </Text>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <React.Fragment key={index}>
                <EventCard event={event} />
              </React.Fragment>
            ))
          ) : (
            <View style={styles.emptyState}>
              <IconSymbol
                ios_icon_name="calendar"
                android_material_icon_name="event"
                size={48}
                color={textSecondaryColor}
              />
              <Text style={[styles.emptyText, { color: textSecondaryColor }]}>
                No upcoming events found
              </Text>
              <Text style={[styles.emptySubtext, { color: textSecondaryColor }]}>
                Try adjusting your filters
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: bgColor }]}>
          <View style={[styles.modalHeader, { backgroundColor: cardColor }]}>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={[styles.modalCancel, { color: colors.primary }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: textColor }]}>Filters</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={[styles.modalDone, { color: colors.primary }]}>Done</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* State Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: textColor }]}>State</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterChipsContainer}
              >
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    selectedState === 'All' && styles.filterChipSelected,
                  ]}
                  onPress={() => {
                    setSelectedState('All');
                    setSelectedCity('All');
                  }}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: selectedState === 'All' ? '#FFFFFF' : textColor },
                    ]}
                  >
                    All States
                  </Text>
                </TouchableOpacity>
                {US_STATES.map((state, index) => (
                  <React.Fragment key={index}>
                    <TouchableOpacity
                      style={[
                        styles.filterChip,
                        selectedState === state.code && styles.filterChipSelected,
                      ]}
                      onPress={() => {
                        setSelectedState(state.code);
                        setSelectedCity('All');
                      }}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          { color: selectedState === state.code ? '#FFFFFF' : textColor },
                        ]}
                      >
                        {state.code}
                      </Text>
                    </TouchableOpacity>
                  </React.Fragment>
                ))}
              </ScrollView>
            </View>

            {/* City Filter */}
            {selectedState !== 'All' && citiesForState.length > 0 && (
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: textColor }]}>City</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filterChipsContainer}
                >
                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      selectedCity === 'All' && styles.filterChipSelected,
                    ]}
                    onPress={() => setSelectedCity('All')}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        { color: selectedCity === 'All' ? '#FFFFFF' : textColor },
                      ]}
                    >
                      All Cities
                    </Text>
                  </TouchableOpacity>
                  {citiesForState.map((city, index) => (
                    <React.Fragment key={index}>
                      <TouchableOpacity
                        style={[
                          styles.filterChip,
                          selectedCity === city && styles.filterChipSelected,
                        ]}
                        onPress={() => setSelectedCity(city)}
                      >
                        <Text
                          style={[
                            styles.filterChipText,
                            { color: selectedCity === city ? '#FFFFFF' : textColor },
                          ]}
                        >
                          {city}
                        </Text>
                      </TouchableOpacity>
                    </React.Fragment>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Event Type Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: textColor }]}>Event Type</Text>
              <View style={styles.filterGrid}>
                {eventTypes.map((type, index) => (
                  <React.Fragment key={index}>
                    <TouchableOpacity
                      style={[
                        styles.filterGridItem,
                        { backgroundColor: cardColor },
                        selectedTypes.includes(type) && styles.filterGridItemSelected,
                      ]}
                      onPress={() => toggleEventType(type)}
                    >
                      <Text
                        style={[
                          styles.filterGridItemText,
                          { color: selectedTypes.includes(type) ? '#FFFFFF' : textColor },
                        ]}
                      >
                        {type}
                      </Text>
                      {selectedTypes.includes(type) && (
                        <IconSymbol
                          ios_icon_name="checkmark"
                          android_material_icon_name="check"
                          size={16}
                          color="#FFFFFF"
                        />
                      )}
                    </TouchableOpacity>
                  </React.Fragment>
                ))}
              </View>
            </View>

            {/* Diaspora Focus Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: textColor }]}>
                Diaspora Focus
              </Text>
              <View style={styles.filterGrid}>
                {diasporaSegments.map((segment, index) => (
                  <React.Fragment key={index}>
                    <TouchableOpacity
                      style={[
                        styles.filterGridItem,
                        { backgroundColor: cardColor },
                        selectedDiaspora.includes(segment) && styles.filterGridItemSelected,
                      ]}
                      onPress={() => toggleDiaspora(segment)}
                    >
                      <Text
                        style={[
                          styles.filterGridItemText,
                          { color: selectedDiaspora.includes(segment) ? '#FFFFFF' : textColor },
                        ]}
                      >
                        {segment}
                      </Text>
                      {selectedDiaspora.includes(segment) && (
                        <IconSymbol
                          ios_icon_name="checkmark"
                          android_material_icon_name="check"
                          size={16}
                          color="#FFFFFF"
                        />
                      )}
                    </TouchableOpacity>
                  </React.Fragment>
                ))}
              </View>
            </View>

            {/* Date Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: textColor }]}>Date</Text>
              <View style={styles.filterGrid}>
                {dateFilters.map((filter, index) => (
                  <React.Fragment key={index}>
                    <TouchableOpacity
                      style={[
                        styles.filterGridItem,
                        { backgroundColor: cardColor },
                        dateFilter === filter && styles.filterGridItemSelected,
                      ]}
                      onPress={() => setDateFilter(filter)}
                    >
                      <Text
                        style={[
                          styles.filterGridItemText,
                          { color: dateFilter === filter ? '#FFFFFF' : textColor },
                        ]}
                      >
                        {filter}
                      </Text>
                      {dateFilter === filter && (
                        <IconSymbol
                          ios_icon_name="checkmark"
                          android_material_icon_name="check"
                          size={16}
                          color="#FFFFFF"
                        />
                      )}
                    </TouchableOpacity>
                  </React.Fragment>
                ))}
              </View>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 48,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterButtonRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  filterBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeFiltersScroll: {
    marginBottom: 16,
  },
  activeFiltersContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  activeFilterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  horizontalList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  featuredCard: {
    width: 300,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 4,
    position: 'relative',
  },
  eventCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 4,
  },
  featuredImage: {
    width: '100%',
    height: 180,
  },
  eventImage: {
    width: '100%',
    height: 200,
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  featuredBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  eventInfo: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  eventSubtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  eventMeta: {
    gap: 8,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '500',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  bottomPadding: {
    height: 40,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
  },
  modalCancel: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalDone: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 32,
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  filterChipsContainer: {
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.highlight,
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterGridItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.highlight,
  },
  filterGridItemSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterGridItemText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
