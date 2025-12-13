
import { StyleSheet } from 'react-native';
import * as AppColors from '@/components/colors';

export const colors = {
  background: AppColors.background,
  backgroundDark: AppColors.backgroundDark,
  backgroundLight: AppColors.backgroundLight,
  text: AppColors.text,
  textDark: AppColors.textDark,
  textLight: AppColors.textLight,
  textSecondary: AppColors.textSecondary,
  textSecondaryDark: AppColors.textSecondaryDark,
  textSecondaryLight: AppColors.textSecondaryLight,
  primary: AppColors.primary,
  secondary: AppColors.secondary,
  accent: AppColors.accent,
  gold: AppColors.gold,
  red: AppColors.red,
  green: AppColors.green,
  card: AppColors.card,
  cardDark: AppColors.cardDark,
  cardLight: AppColors.cardLight,
  cardElevated: AppColors.cardElevated,
  highlight: AppColors.highlight,
  highlightDark: AppColors.highlightDark,
  highlightLight: AppColors.highlightLight,
  border: AppColors.border,
};

// Premium Typography System
// Inspired by Montserrat, Poppins, and Gotham
export const typography = {
  // Font Families
  fonts: {
    // Headlines - Montserrat ExtraBold: strong geometric shapes, tall uppercase letters
    headline: 'Montserrat-ExtraBold',
    headlineBold: 'Montserrat-Bold',
    headlineSemiBold: 'Montserrat-SemiBold',
    
    // UI Labels & Subheadlines - Poppins Medium: smooth, rounded, minimalist
    ui: 'Poppins-Medium',
    uiSemiBold: 'Poppins-SemiBold',
    
    // Body Text - Poppins Regular: clean lines, neutral, excellent legibility
    body: 'Poppins-Regular',
    
    // Captions - Poppins Light: subtle and refined
    caption: 'Poppins-Light',
  },
  
  // Typography Hierarchy Styles
  h1: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
    textTransform: 'uppercase' as const,
  },
  
  h2: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  
  h3: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
  },
  
  h4: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0,
  },
  
  h5: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: 0,
  },
  
  h6: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  
  // Body Text Variants
  bodyLarge: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 0.15,
  },
  
  body: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  
  bodySmall: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  
  // UI Labels
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  
  labelLarge: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  
  labelSmall: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  
  // Captions
  caption: {
    fontFamily: 'Poppins-Light',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  
  captionSmall: {
    fontFamily: 'Poppins-Light',
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.4,
  },
  
  // Button Text
  button: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  
  buttonLarge: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  
  buttonSmall: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    width: '100%',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  
  // Updated with new typography system
  title: {
    ...typography.h1,
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10,
  },
  
  subtitle: {
    ...typography.h3,
    textAlign: 'center',
    color: colors.text,
    marginBottom: 8,
  },
  
  text: {
    ...typography.body,
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  
  textLarge: {
    ...typography.bodyLarge,
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  
  textSmall: {
    ...typography.bodySmall,
    color: colors.text,
    marginBottom: 6,
    textAlign: 'center',
  },
  
  label: {
    ...typography.label,
    color: colors.text,
    marginBottom: 4,
  },
  
  caption: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 4px 16px rgba(212, 175, 55, 0.15)',
    elevation: 4,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.primary,
  },
});

// Export individual text style helpers for easy use
export const textStyles = StyleSheet.create({
  h1: {
    ...typography.h1,
    color: colors.text,
  },
  h1Gold: {
    ...typography.h1,
    color: colors.gold,
  },
  h2: {
    ...typography.h2,
    color: colors.text,
  },
  h3: {
    ...typography.h3,
    color: colors.text,
  },
  h4: {
    ...typography.h4,
    color: colors.text,
  },
  h5: {
    ...typography.h5,
    color: colors.text,
  },
  h6: {
    ...typography.h6,
    color: colors.text,
  },
  bodyLarge: {
    ...typography.bodyLarge,
    color: colors.text,
  },
  body: {
    ...typography.body,
    color: colors.text,
  },
  bodySmall: {
    ...typography.bodySmall,
    color: colors.text,
  },
  bodySecondary: {
    ...typography.body,
    color: colors.textSecondary,
  },
  label: {
    ...typography.label,
    color: colors.text,
  },
  labelLarge: {
    ...typography.labelLarge,
    color: colors.text,
  },
  labelSmall: {
    ...typography.labelSmall,
    color: colors.text,
  },
  labelSecondary: {
    ...typography.label,
    color: colors.textSecondary,
  },
  caption: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  captionSmall: {
    ...typography.captionSmall,
    color: colors.textSecondary,
  },
  button: {
    ...typography.button,
    color: colors.text,
  },
  buttonLarge: {
    ...typography.buttonLarge,
    color: colors.text,
  },
  buttonSmall: {
    ...typography.buttonSmall,
    color: colors.text,
  },
});
