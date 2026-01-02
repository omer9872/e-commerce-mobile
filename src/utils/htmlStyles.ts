import {colors} from '../theme/colors';

export const getThemeAwareHtmlStyles = (themeColors: typeof colors.light) => ({
  baseStyle: {
    color: themeColors.text,
    lineHeight: 22,
  },
  tagsStyles: {
    p: {
      color: themeColors.text,
      marginBottom: 4, // Reduced paragraph spacing
      marginTop: 0,
      lineHeight: 22,
    },
    h1: {
      color: themeColors.text,
      fontWeight: 'bold' as const,
      fontSize: 24,
      marginBottom: 12,
      marginTop: 8,
    },
    h2: {
      color: themeColors.text,
      fontWeight: 'bold' as const,
      fontSize: 20,
      marginBottom: 10,
      marginTop: 6,
    },
    h3: {
      color: themeColors.text,
      fontWeight: 'bold' as const,
      fontSize: 18,
      marginBottom: 8,
      marginTop: 4,
    },
    h4: {
      color: themeColors.text,
      fontWeight: 'bold' as const,
      fontSize: 16,
      marginBottom: 6,
      marginTop: 4,
    },
    h5: {
      color: themeColors.text,
      fontWeight: 'bold' as const,
      fontSize: 14,
      marginBottom: 4,
      marginTop: 2,
    },
    h6: {
      color: themeColors.text,
      fontWeight: 'bold' as const,
      fontSize: 12,
      marginBottom: 4,
      marginTop: 2,
    },
    strong: {
      color: themeColors.text,
      fontWeight: 'bold' as const,
    },
    b: {
      color: themeColors.text,
      fontWeight: 'bold' as const,
    },
    em: {
      color: themeColors.text,
      fontStyle: 'italic' as const,
    },
    i: {
      color: themeColors.text,
      fontStyle: 'italic' as const,
    },
    span: {
      color: themeColors.text,
    },
    div: {
      color: themeColors.text,
      marginBottom: 4, // Add some spacing for div elements
      marginTop: 0,
    },
    li: {
      color: themeColors.text,
      marginBottom: 2,
    },
    ul: {
      color: themeColors.text,
      marginBottom: 8,
      marginTop: 4,
    },
    ol: {
      color: themeColors.text,
      marginBottom: 8,
      marginTop: 4,
    },
    a: {
      color: themeColors.primary,
      textDecorationLine: 'underline' as const,
    },
    blockquote: {
      color: themeColors.textSecondary,
      fontStyle: 'italic' as const,
      borderLeftWidth: 3,
      borderLeftColor: themeColors.primary,
      paddingLeft: 12,
      marginLeft: 8,
      marginBottom: 8,
      marginTop: 4,
    },
    code: {
      color: themeColors.text,
      backgroundColor: themeColors.surfaceVariant,
      fontFamily: 'monospace',
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
    },
    pre: {
      color: themeColors.text,
      backgroundColor: themeColors.surfaceVariant,
      fontFamily: 'monospace',
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
      marginTop: 4,
    },
    table: {
      color: themeColors.text,
      borderWidth: 1,
      borderColor: themeColors.outline,
      marginBottom: 8,
      marginTop: 4,
    },
    th: {
      color: themeColors.text,
      fontWeight: 'bold' as const,
      backgroundColor: themeColors.surfaceVariant,
      padding: 8,
      borderWidth: 1,
      borderColor: themeColors.outline,
    },
    td: {
      color: themeColors.text,
      padding: 8,
      borderWidth: 1,
      borderColor: themeColors.outline,
    },
    hr: {
      backgroundColor: themeColors.outline,
      height: 1,
      marginVertical: 12,
    },
    body: {
      color: themeColors.text,
      lineHeight: 22,
      margin: 0,
      padding: 0,
    },
    br: {
      height: 0,
      marginTop: 0,
      marginBottom: 0,
    },
  },
});
