
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
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
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
