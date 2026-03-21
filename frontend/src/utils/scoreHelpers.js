export const getRiskLevel = (score) => {
  if (score >= 70) return 'healthy';
  if (score >= 40) return 'needs_attention';
  return 'at_risk';
};

export const getRiskLabel = (score) => {
  if (score >= 70) return 'Healthy';
  if (score >= 40) return 'Needs Attention';
  return 'At Risk';
};

export const getRiskColors = (score) => {
  if (score >= 70) return {
    bg: '#dcfce7', text: '#16a34a',
    bar: '#16a34a', border: '#86efac',
    light: '#f0fdf4'
  };
  if (score >= 40) return {
    bg: '#fef9c3', text: '#d97706',
    bar: '#d97706', border: '#fde68a',
    light: '#fffbeb'
  };
  return {
    bg: '#fee2e2', text: '#dc2626',
    bar: '#dc2626', border: '#fca5a5',
    light: '#fef2f2'
  };
};

export const getInitials = (name) => {
  if (!name) return '??';
  return name.split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
