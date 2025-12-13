
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, typography, textStyles } from '@/styles/commonStyles';

/**
 * Typography Guide Component
 * 
 * Demonstrates the premium typography system inspired by:
 * - Montserrat ExtraBold for headlines (strong, geometric, confident)
 * - Poppins Medium for UI labels (smooth, rounded, minimalist)
 * - Poppins Regular for body text (clean, neutral, excellent legibility)
 * - Poppins Light for captions (subtle and refined)
 * 
 * This component serves as a reference for developers to see all available
 * typography styles in the app.
 */
export default function TypographyGuide() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>HEADLINES</Text>
        <Text style={styles.description}>Montserrat ExtraBold - Strong, geometric, contemporary</Text>
        
        <View style={styles.example}>
          <Text style={textStyles.h1}>H1 HEADLINE</Text>
          <Text style={styles.meta}>Montserrat ExtraBold, 32px, Uppercase</Text>
        </View>
        
        <View style={styles.example}>
          <Text style={textStyles.h2}>H2 Subheadline</Text>
          <Text style={styles.meta}>Montserrat SemiBold, 28px</Text>
        </View>
        
        <View style={styles.example}>
          <Text style={textStyles.h3}>H3 Section Title</Text>
          <Text style={styles.meta}>Poppins SemiBold, 24px</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>BODY TEXT</Text>
        <Text style={styles.description}>Poppins Regular - Clean, neutral, professional</Text>
        
        <View style={styles.example}>
          <Text style={textStyles.bodyLarge}>
            Large body text for important content. Clean lines and excellent legibility in both light and dark mode.
          </Text>
          <Text style={styles.meta}>Poppins Regular, 18px</Text>
        </View>
        
        <View style={styles.example}>
          <Text style={textStyles.body}>
            Standard body text for general content. Highly readable with balanced spacing and neutral tone.
          </Text>
          <Text style={styles.meta}>Poppins Regular, 16px</Text>
        </View>
        
        <View style={styles.example}>
          <Text style={textStyles.bodySmall}>
            Small body text for secondary information. Maintains readability at smaller sizes.
          </Text>
          <Text style={styles.meta}>Poppins Regular, 14px</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>UI LABELS</Text>
        <Text style={styles.description}>Poppins Medium - Smooth, rounded, minimalist</Text>
        
        <View style={styles.example}>
          <Text style={textStyles.labelLarge}>Large UI Label</Text>
          <Text style={styles.meta}>Poppins Medium, 16px</Text>
        </View>
        
        <View style={styles.example}>
          <Text style={textStyles.label}>Standard UI Label</Text>
          <Text style={styles.meta}>Poppins Medium, 14px</Text>
        </View>
        
        <View style={styles.example}>
          <Text style={textStyles.labelSmall}>SMALL LABEL</Text>
          <Text style={styles.meta}>Poppins Medium, 12px, Uppercase</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CAPTIONS</Text>
        <Text style={styles.description}>Poppins Light - Subtle and refined</Text>
        
        <View style={styles.example}>
          <Text style={textStyles.caption}>Standard caption text for metadata</Text>
          <Text style={styles.meta}>Poppins Light, 12px</Text>
        </View>
        
        <View style={styles.example}>
          <Text style={textStyles.captionSmall}>Small caption for fine print</Text>
          <Text style={styles.meta}>Poppins Light, 10px</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>BUTTONS</Text>
        <Text style={styles.description}>Poppins SemiBold - Clear and actionable</Text>
        
        <View style={[styles.example, styles.buttonExample]}>
          <View style={styles.buttonLarge}>
            <Text style={[textStyles.buttonLarge, { color: colors.background }]}>
              LARGE BUTTON
            </Text>
          </View>
          <Text style={styles.meta}>Poppins SemiBold, 18px, Uppercase</Text>
        </View>
        
        <View style={[styles.example, styles.buttonExample]}>
          <View style={styles.button}>
            <Text style={[textStyles.button, { color: colors.background }]}>
              STANDARD BUTTON
            </Text>
          </View>
          <Text style={styles.meta}>Poppins SemiBold, 16px, Uppercase</Text>
        </View>
        
        <View style={[styles.example, styles.buttonExample]}>
          <View style={styles.buttonSmall}>
            <Text style={[textStyles.buttonSmall, { color: colors.background }]}>
              SMALL BUTTON
            </Text>
          </View>
          <Text style={styles.meta}>Poppins Medium, 14px, Uppercase</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>COLOR VARIANTS</Text>
        <Text style={styles.description}>Typography with brand colors</Text>
        
        <View style={styles.example}>
          <Text style={textStyles.h1Gold}>GOLD HEADLINE</Text>
          <Text style={styles.meta}>H1 with Gold accent</Text>
        </View>
        
        <View style={styles.example}>
          <Text style={textStyles.bodySecondary}>Secondary body text</Text>
          <Text style={styles.meta}>Body with secondary color</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.gold,
    marginBottom: 8,
    letterSpacing: 1,
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  example: {
    marginBottom: 24,
  },
  meta: {
    ...typography.captionSmall,
    color: colors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  buttonExample: {
    alignItems: 'center',
  },
  buttonLarge: {
    backgroundColor: colors.gold,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: colors.gold,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSmall: {
    backgroundColor: colors.gold,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
