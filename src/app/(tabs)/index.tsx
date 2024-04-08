import { useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'

import { Button } from '@/components/button'
import { Item } from '@/components/item';
import { ButtonSend } from '@/components/button-send';

export default function Home() {
  const [selectedImageUri, setSelectedImageUri] = useState('');

  async function handleSelectImage() {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== ImagePicker.PermissionStatus.GRANTED) {
        return Alert.alert('É necessário conceder permissão para acessar a galeria de imagens!')
      }

      const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (response.canceled) {
        return;
      }

      if (!response.canceled) {
        
      }

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View className='flex-1 bg-white'>
      <Button onPress={handleSelectImage} />

      {
        selectedImageUri ?
          <Image
            source={{ uri: selectedImageUri }}
            className='flex-1'
            resizeMode="cover"
          />
          :
          <Text className='text-green-600 font-body text-center text-sm flex-1' style={{ textAlignVertical: "center" }}>
            Selecione a foto da sua plantação para analisar.
          </Text>
      }

      <View className="flex-1 bg-gray-300 rounded-t-3xl px-6 -mt-10 pt-3">
        <ButtonSend message="Enviar imagem" />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 24 }}>
          <View className="flex-1 gap-3">
            <Item data={{ name: 'Soja com praga', percentage: '95%' }} />
            <Item data={{ name: 'Soja saudável', percentage: '5%' }} />
          </View>
        </ScrollView>
      </View>
    </View>
  )
}