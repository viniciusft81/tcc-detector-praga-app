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
    <View className="w-full h-14 bg-white rounded-lg flex-row items-center p-3 gap-3">
      <Text className="font-heading text-sm bg-green-200 h-10 w-10 rounded-lg text-center" style={{ textAlignVertical: "center" }}>
        {data.percentage}
      </Text>

      <Text className="font-body text-base">
        {data.name}
      </Text>
    </View>
  );
}