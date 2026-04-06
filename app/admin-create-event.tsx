
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import * as colors from '@/components/colors';
import { EventType, DiasporaSegment } from '@/types/database.types';
import { MOCK_EVENTS } from '@/constants/MockEventData';
import { MOCK_VENDORS } from '@/constants/MockVendorData';
import { US_STATES, MAJOR_CITIES_BY_STATE } from '@/constants/LocationData';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';

const EVENT_TYPES: EventType[] = [
  'Brunch',
  'Festival',
  'Pop-up',
  'Market',
  'Tasting',
  'Party',
  'Meetup',
];

const DIASPORA_SEGMENTS: DiasporaSegment[] = [
  'African American',
  'Caribbean',
  'African',
  'Pan-African',
];

const CUISINES = [
  'Nigerian',
  'Jamaican',
  'Soul Food',
  'Ethiopian',
  'Ghanaian',
  'Haitian',
  'Trinidadian',
  'Senegalese',
  'Kenyan',
  'Southern',
  'Creole',
  'Caribbean',
];

export default function AdminCreateEventScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditing = !!id;

  // Find existing event if editing
  const existingEvent = isEditing
    ? MOCK_EVENTS.find((e) => e.id === id)
    : null;

  const [title, setTitle] = useState(existingEvent?.title || '');
  const [subtitle, setSubtitle] = useState(existingEvent?.subtitle || '');
  const [description, setDescription] = useState(existingEvent?.description || '');
  const [eventType, setEventType] = useState<EventType>(
    existingEvent?.event_type || 'Brunch'
  );
  const [diasporaFocus, setDiasporaFocus] = useState<DiasporaSegment[]>(
    existingEvent?.diaspora_focus || []
  );
  const [cuisinesHighlighted, setCuisinesHighlighted] = useState<string[]>(
    existingEvent?.cuisines_highlighted || []
  );
  const [state, setState] = useState(existingEvent?.state || '');
  const [city, setCity] = useState(existingEvent?.city || '');
  const [venueName, setVenueName] = useState(existingEvent?.venue_name || '');
  const [venueAddress, setVenueAddress] = useState(
    existingEvent?.venue_address_line1 || ''
  );
  const [venueZip, setVenueZip] = useState(existingEvent?.venue_zip || '');
  const [startDate, setStartDate] = useState(
    existingEvent?.start_datetime || new Date().toISOString()
  );
  const [endDate, setEndDate] = useState(
    existingEvent?.end_datetime || new Date().toISOString()
  );
  const [isAllDay, setIsAllDay] = useState(existingEvent?.is_all_day || false);
  const [isOnline, setIsOnline] = useState(existingEvent?.is_online || false);
  const [linkedVendorId, setLinkedVendorId] = useState(
    existingEvent?.linked_vendor_id || ''
  );
  const [heroImage, setHeroImage] = useState(existingEvent?.hero_image || '');
  const [capacity, setCapacity] = useState(
    existingEvent?.capacity?.toString() || ''
  );
  const [ticketRequired, setTicketRequired] = useState(
    existingEvent?.ticket_required || false
  );
  const [ticketUrl, setTicketUrl] = useState(existingEvent?.ticket_url || '');
  const [isFeatured, setIsFeatured] = useState(existingEvent?.is_featured || false);
  const [isPublished, setIsPublished] = useState(
    existingEvent?.is_published ?? true
  );

  const toggleDiasporaFocus = (segment: DiasporaSegment) => {
    if (diasporaFocus.includes(segment)) {
      setDiasporaFocus(diasporaFocus.filter((s) => s !== segment));
    } else {
      setDiasporaFocus([...diasporaFocus, segment]);
    }
  };

  const toggleCuisine = (cuisine: string) => {
    if (cuisinesHighlighted.includes(cuisine)) {
      setCuisinesHighlighted(cuisinesHighlighted.filter((c) => c !== cuisine));
    } else {
      setCuisinesHighlighted([...cuisinesHighlighted, cuisine]);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setHeroImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter an event title');
      return;
    }

    if (diasporaFocus.length === 0) {
      Alert.alert('Error', 'Please select at least one diaspora focus');
      return;
    }

    if (!state || !city) {
      Alert.alert('Error', 'Please select state and city');
      return;
    }

    // TODO: Save event to database
    console.log('Saving event:', {
      title,
      subtitle,
      description,
      eventType,
      diasporaFocus,
      cuisinesHighlighted,
      state,
      city,
      venueName,
      venueAddress,
      venueZip,
      startDate,
      endDate,
      isAllDay,
      isOnline,
      linkedVendorId,
      heroImage,
      capacity,
      ticketRequired,
      ticketUrl,
      isFeatured,
      isPublished,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Alert.alert(
      'Success',
      isEditing ? 'Event updated successfully' : 'Event created successfully',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const citiesForState = state ? MAJOR_CITIES_BY_STATE[state] || [] : [];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <IconSymbol
                ios_icon_name="chevron.left"
                android_material_icon_name="arrow-back"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {isEditing ? 'Edit Event' : 'Create Event'}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Hero Image */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hero Image *</Text>
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={handlePickImage}
            >
              {heroImage ? (
                <Image source={{ uri: heroImage }} style={styles.heroImagePreview} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <IconSymbol
                    ios_icon_name="photo"
                    android_material_icon_name="image"
                    size={48}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.imagePlaceholderText}>Tap to select image</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Basic Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Event title"
                placeholderTextColor={colors.textSecondary}
                value={title}
                onChangeText={setTitle}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Subtitle</Text>
              <TextInput
                style={styles.input}
                placeholder="Short tagline"
                placeholderTextColor={colors.textSecondary}
                value={subtitle}
                onChangeText={setSubtitle}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell attendees about this event..."
                placeholderTextColor={colors.textSecondary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={6}
              />
            </View>
          </View>

          {/* Event Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Event Type *</Text>
            <View style={styles.chipGrid}>
              {EVENT_TYPES.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.chip,
                    eventType === type && styles.chipActive,
                  ]}
                  onPress={() => setEventType(type)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      eventType === type && styles.chipTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Diaspora Focus */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Diaspora Focus *</Text>
            <View style={styles.chipGrid}>
              {DIASPORA_SEGMENTS.map((segment, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.chip,
                    diasporaFocus.includes(segment) && styles.chipActive,
                  ]}
                  onPress={() => toggleDiasporaFocus(segment)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      diasporaFocus.includes(segment) && styles.chipTextActive,
                    ]}
                  >
                    {segment}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Cuisines Highlighted */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cuisines Highlighted</Text>
            <View style={styles.chipGrid}>
              {CUISINES.map((cuisine, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.chip,
                    cuisinesHighlighted.includes(cuisine) && styles.chipActive,
                  ]}
                  onPress={() => toggleCuisine(cuisine)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      cuisinesHighlighted.includes(cuisine) && styles.chipTextActive,
                    ]}
                  >
                    {cuisine}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>State *</Text>
                <View style={styles.pickerContainer}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.pickerScroll}
                  >
                    {US_STATES.map((s, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.pickerChip,
                          state === s.code && styles.pickerChipActive,
                        ]}
                        onPress={() => {
                          setState(s.code);
                          setCity('');
                        }}
                      >
                        <Text
                          style={[
                            styles.pickerChipText,
                            state === s.code && styles.pickerChipTextActive,
                          ]}
                        >
                          {s.code}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>
            {state && citiesForState.length > 0 && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>City *</Text>
                <View style={styles.pickerContainer}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.pickerScroll}
                  >
                    {citiesForState.map((c, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.pickerChip,
                          city === c && styles.pickerChipActive,
                        ]}
                        onPress={() => setCity(c)}
                      >
                        <Text
                          style={[
                            styles.pickerChipText,
                            city === c && styles.pickerChipTextActive,
                          ]}
                        >
                          {c}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            )}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Venue Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Venue or location name"
                placeholderTextColor={colors.textSecondary}
                value={venueName}
                onChangeText={setVenueName}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Venue Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Street address"
                placeholderTextColor={colors.textSecondary}
                value={venueAddress}
                onChangeText={setVenueAddress}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>ZIP Code</Text>
              <TextInput
                style={styles.input}
                placeholder="90001"
                placeholderTextColor={colors.textSecondary}
                value={venueZip}
                onChangeText={setVenueZip}
                keyboardType="number-pad"
              />
            </View>
          </View>

          {/* Event Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Event Options</Text>
            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => setIsOnline(!isOnline)}
            >
              <Text style={styles.toggleLabel}>Online Event</Text>
              <View
                style={[
                  styles.toggle,
                  isOnline && { backgroundColor: colors.primary },
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    isOnline && styles.toggleThumbActive,
                  ]}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => setIsAllDay(!isAllDay)}
            >
              <Text style={styles.toggleLabel}>All Day Event</Text>
              <View
                style={[
                  styles.toggle,
                  isAllDay && { backgroundColor: colors.primary },
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    isAllDay && styles.toggleThumbActive,
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Ticketing */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ticketing</Text>
            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => setTicketRequired(!ticketRequired)}
            >
              <Text style={styles.toggleLabel}>Ticket Required</Text>
              <View
                style={[
                  styles.toggle,
                  ticketRequired && { backgroundColor: colors.primary },
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    ticketRequired && styles.toggleThumbActive,
                  ]}
                />
              </View>
            </TouchableOpacity>
            {ticketRequired && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Ticket URL</Text>
                <TextInput
                  style={styles.input}
                  placeholder="https://eventbrite.com/..."
                  placeholderTextColor={colors.textSecondary}
                  value={ticketUrl}
                  onChangeText={setTicketUrl}
                  autoCapitalize="none"
                  keyboardType="url"
                />
              </View>
            )}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Capacity (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Maximum attendees"
                placeholderTextColor={colors.textSecondary}
                value={capacity}
                onChangeText={setCapacity}
                keyboardType="number-pad"
              />
            </View>
          </View>

          {/* Linked Vendor */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Linked Vendor (Optional)</Text>
            <View style={styles.pickerContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.pickerScroll}
              >
                <TouchableOpacity
                  style={[
                    styles.pickerChip,
                    linkedVendorId === '' && styles.pickerChipActive,
                  ]}
                  onPress={() => setLinkedVendorId('')}
                >
                  <Text
                    style={[
                      styles.pickerChipText,
                      linkedVendorId === '' && styles.pickerChipTextActive,
                    ]}
                  >
                    None
                  </Text>
                </TouchableOpacity>
                {MOCK_VENDORS.filter((v) => v.is_active).map((vendor, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.pickerChip,
                      linkedVendorId === vendor.id && styles.pickerChipActive,
                    ]}
                    onPress={() => setLinkedVendorId(vendor.id)}
                  >
                    <Text
                      style={[
                        styles.pickerChipText,
                        linkedVendorId === vendor.id && styles.pickerChipTextActive,
                      ]}
                    >
                      {vendor.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Publishing Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Publishing</Text>
            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => setIsPublished(!isPublished)}
            >
              <Text style={styles.toggleLabel}>Published</Text>
              <View
                style={[
                  styles.toggle,
                  isPublished && { backgroundColor: colors.primary },
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    isPublished && styles.toggleThumbActive,
                  ]}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => setIsFeatured(!isFeatured)}
            >
              <Text style={styles.toggleLabel}>Featured</Text>
              <View
                style={[
                  styles.toggle,
                  isFeatured && { backgroundColor: colors.primary },
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    isFeatured && styles.toggleThumbActive,
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Update Event' : 'Create Event'}
            </Text>
          </TouchableOpacity>

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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  imagePickerButton: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.highlight,
    borderStyle: 'dashed',
  },
  heroImagePreview: {
    width: '100%',
    height: 200,
  },
  imagePlaceholder: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.highlight,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.highlight,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  pickerContainer: {
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.highlight,
  },
  pickerScroll: {
    padding: 8,
    gap: 8,
  },
  pickerChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.highlight,
  },
  pickerChipActive: {
    backgroundColor: colors.primary,
  },
  pickerChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  pickerChipTextActive: {
    color: '#FFFFFF',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    padding: 2,
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
