import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type Props = TouchableOpacityProps & {
  title: string;
}

export function ButtonSend({ title, ...rest }: Props) {
  const colorButton = title === 'Incorreta' ? 'bg-red-500' : 'bg-green-600';

  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      className={`h-12 w-1/2 ${colorButton} align-center justify-center rounded-md`}
      {...rest}
    >
      <Text className="text-white font-body text-sm self-center">{title}</Text>
    </TouchableOpacity>
  );
}