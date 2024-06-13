import { Text, View } from 'react-native';

export type ItemProps = {
  name: string;
  percentage: string;
}

type Props = {
  data: ItemProps;
}

export function Item({ data }: Props) {
  return (
    <View className="w-96 h-14 bg-emerald-900 rounded-lg flex-row items-center p-3 gap-3 self-center">
      <Text className="font-heading text-sm bg-green-200 h-10 w-10 rounded-lg text-center" style={{ textAlignVertical: "center" }}>
        {data.percentage}
      </Text>

      <Text className="font-body text-base text-white">
        {data.name}
      </Text>
    </View>
  );
}