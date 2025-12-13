
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import * as colors from '@/components/colors';
import { Event, EventType, DiasporaSegment } from '@/types/database.types';
import { MOCK_EVENTS } from '@/constants/MockEventData';
import * as Haptics from 'expo-haptics';

export default function AdminEventsScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState<string>('all');
  const [filterType, setFilterType] = useState<EventType | 'all'>('all');
  const [filterPublished, setFilterPublished] = useState<'all' | 'published' | 'unpublished'>('all');

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = filterState === 'all' || event.state === filterState;
    const matchesType = filterType === 'all' || event.event_type === filterType;
    const matchesPublished =
      filterPublished === 'all' ||
      (filterPublished === 'published' && event.is_published) ||
      (filterPublished === 'unpublished' && !event.is_published);

    return matchesSearch && matchesState && matchesType && matchesPublished;
  });

  const handleTogglePublished = (eventId: string) => {
    setEvents(
      events.map((e) =>
        e.id === eventId ? { ...e, is_published: !e.is_published } : e
      )
    );
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleToggleFeatured = (eventId: string) => {
    setEvents(
      events.map((e) =>
        e.id === eventId ? { ...e, is_featured: !e.is_featured } : e
      )
    );
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleDeleteEvent = (eventId: string) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setEvents(events.filter((e) => e.id !== eventId));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Success', 'Event deleted successfully');
          },
        },
      ]
    );
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <IconSymbol
                ios_icon_name="chevron.left"
                android_material_icon_name="arrow_back"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Events Management</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/admin-create-event')}
            >
              <IconSymbol
                ios_icon_name="plus"
                android_material_icon_name="add"
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <IconSymbol
              ios_icon_name="magnifyingglass"
              android_material_icon_name="search"
              size={20}
              color={colors.textSecondary}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search events..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filters */}
          <View style={styles.filtersSection}>
            <Text style={styles.filtersTitle}>Filters</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterChips}>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    filterPublished === 'all' && styles.filterChipActive,
                  ]}
                  onPress={() => setFilterPublished('all')}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      filterPublished === 'all' && styles.filterChipTextActive,
                    ]}
                  >
                    All Status
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    filterPublished === 'published' && styles.filterChipActive,
                  ]}
                  onPress={() => setFilterPublished('published')}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      filterPublished === 'published' && styles.filterChipTextActive,
                    ]}
                  >
                    Published
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    filterPublished === 'unpublished' && styles.filterChipActive,
                  ]}
                  onPress={() => setFilterPublished('unpublished')}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      filterPublished === 'unpublished' && styles.filterChipTextActive,
                    ]}
                  >
                    Unpublished
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          {/* Events List */}
          <View style={styles.eventsList}>
            <Text style={styles.resultsCount}>
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
            </Text>
            {filteredEvents.map((event, index) => (
              <View key={index} style={styles.eventCard}>
                <Image source={{ uri: event.hero_image }} style={styles.eventImage} />
                <View style={styles.eventContent}>
                  <View style={styles.eventHeader}>
                    <View style={styles.eventInfo}>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      <Text style={styles.eventLocation}>
                        {event.city}, {event.state}
                      </Text>
                      <Text style={styles.eventDate}>
                        {formatEventDate(event.start_datetime)}
                      </Text>
                    </View>
                    <View style={styles.badges}>
                      {event.is_published && (
                        <View
                          style={[
                            styles.statusBadge,
                            { backgroundColor: '#34C75920' },
                          ]}
                        >
                          <Text style={[styles.statusText, { color: '#34C759' }]}>
                            PUBLISHED
                          </Text>
                        </View>
                      )}
                      {!event.is_published && (
                        <View
                          style={[
                            styles.statusBadge,
                            { backgroundColor: '#FF950020' },
                          ]}
                        >
                          <Text style={[styles.statusText, { color: '#FF9500' }]}>
                            DRAFT
                          </Text>
                        </View>
                      )}
                      {event.is_featured && (
                        <View
                          style={[
                            styles.statusBadge,
                            { backgroundColor: colors.primary + '20' },
                          ]}
                        >
                          <IconSymbol
                            ios_icon_name="star.fill"
                            android_material_icon_name="star"
                            size={12}
                            color={colors.primary}
                          />
                          <Text style={[styles.statusText, { color: colors.primary }]}>
                            FEATURED
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.eventMeta}>
                    <View style={styles.metaItem}>
                      <IconSymbol
                        ios_icon_name="tag.fill"
                        android_material_icon_name="label"
                        size={14}
                        color={colors.textSecondary}
                      />
                      <Text style={styles.metaText}>{event.event_type}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <IconSymbol
                        ios_icon_name="person.3.fill"
                        android_material_icon_name="group"
                        size={14}
                        color={colors.textSecondary}
                      />
                      <Text style={styles.metaText}>
                        {event.diaspora_focus.join(', ')}
                      </Text>
                    </View>
                    {event.capacity && (
                      <View style={styles.metaItem}>
                        <IconSymbol
                          ios_icon_name="person.fill"
                          android_material_icon_name="person"
                          size={14}
                          color={colors.textSecondary}
                        />
                        <Text style={styles.metaText}>Cap: {event.capacity}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.eventActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleTogglePublished(event.id)}
                    >
                      <IconSymbol
                        ios_icon_name={
                          event.is_published ? 'eye.slash.fill' : 'eye.fill'
                        }
                        android_material_icon_name={
                          event.is_published ? 'visibility_off' : 'visibility'
                        }
                        size={16}
                        color={colors.primary}
                      />
                      <Text style={styles.actionButtonText}>
                        {event.is_published ? 'Unpublish' : 'Publish'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleToggleFeatured(event.id)}
                    >
                      <IconSymbol
                        ios_icon_name={
                          event.is_featured ? 'star.fill' : 'star'
                        }
                        android_material_icon_name={
                          event.is_featured ? 'star' : 'star_border'
                        }
                        size={16}
                        color={colors.primary}
                      />
                      <Text style={styles.actionButtonText}>
                        {event.is_featured ? 'Unfeature' : 'Feature'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() =>
                        router.push(`/admin-create-event?id=${event.id}`)
                      }
                    >
                      <IconSymbol
                        ios_icon_name="pencil"
                        android_material_icon_name="edit"
                        size={16}
                        color={colors.primary}
                      />
                      <Text style={styles.actionButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDeleteEvent(event.id)}
                    >
                      <IconSymbol
                        ios_icon_name="trash"
                        android_material_icon_name="delete"
                        size={16}
                        color="#FF3B30"
                      />
                      <Text style={[styles.actionButtonText, { color: '#FF3B30' }]}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Spacer */}
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    gap: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  filtersSection: {
    marginBottom: 20,
  },
  filtersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  filterChips: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.highlight,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  eventsList: {
    gap: 16,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  eventCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  eventImage: {
    width: '100%',
    height: 160,
  },
  eventContent: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  eventDate: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  badges: {
    gap: 6,
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  eventMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  eventActions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.highlight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});
