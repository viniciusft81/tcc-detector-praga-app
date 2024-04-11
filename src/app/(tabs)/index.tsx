import { useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'

import { api } from '@/services/api'

import { Button } from '@/components/button'
import { Item, ItemProps } from '@/components/item';
import { ButtonSend } from '@/components/button-send';
import Loading from '@/components/loading';

interface ResponseTypePlant {
  pred_class: string,
  prague_prob: number, 
  healthy_prob: number
  message?: string
}

export default function Home() {
  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState<ItemProps[]>([])

  async function handleSelectImage() {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== ImagePicker.PermissionStatus.GRANTED) {
        return Alert.alert('É necessário conceder permissão para acessar a galeria de imagens!')
      }

      setIsLoading(true)

      const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (response.canceled) {
        return setIsLoading(false);
      }

      if (!response.canceled) {
        const imgManipuled = await ImageManipulator.manipulateAsync(
          response.assets[0].uri,
          [{ resize: { width: 500 } }],
          { 
            compress: 1, 
            format: ImageManipulator.SaveFormat.JPEG ,
            base64: true
          }
        );
        setSelectedImageUri(imgManipuled.uri)
        pragueDetect(imgManipuled.base64)
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function pragueDetect(imageBase64: string | undefined) {
    const {data, status} = await api.post<ResponseTypePlant>('/predict', { 
      "inputs": [
        {
          "data": {
            "image": {
              "base64": imageBase64
            }
          }
        }
      ]
    })

    if (status !== 200) {
      return Alert.alert('Erro ao analisar a imagem, tente novamente!')
    }

    let newItems:ItemProps[] 
    
    if (data.message) {
      newItems = [
        {name: data.message, percentage: "100%"},
      ]
    } else {
      newItems = [
        {name: "Saudável", percentage: `${Math.round(data.healthy_prob*100)}%`},
        {name: "Praga", percentage: `${Math.round(data.prague_prob*100)}%`},
      ]
    }

    console.log(newItems)
    setItems(newItems)
    setIsLoading(false)
  }

  return (
    <View className='flex-1 bg-white'>
      <Button onPress={handleSelectImage} disabled={isLoading} />

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
        {
          isLoading ? <Loading /> :
          <>
            <ButtonSend message="Enviar imagem" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 24 }}>
              <View className="flex-1 gap-3">
                {
                  items.map((item, index) => (
                    <Item key={index} data={item} />
                  ))
            
                }
              </View>
            </ScrollView>
          </>
        }
      </View>
    </View>
  )
}