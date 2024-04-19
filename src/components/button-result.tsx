import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type Props = TouchableOpacityProps & {
  title: string;
}

export function ButtonResult({ title, ...rest }: Props) {
  const colorButton = title === 'Incorreta' ? 'bg-transparent' : 'bg-green-600';
  const colorText = title === 'Incorreta' ? 'text-red-500' : 'text-white';

  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      className={`h-12 w-1/2 ${colorButton} align-center justify-center rounded-md`}
      {...rest}
    >
      <Text className={`${colorText} font-body text-sm self-center`}>{title}</Text>
    </TouchableOpacity>
  );
}