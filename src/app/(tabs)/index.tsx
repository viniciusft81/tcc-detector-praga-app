import { useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'

import { api } from '@/services/api'

import { Button } from '@/components/button'
import { Item, ItemProps } from '@/components/item';
import { ButtonSend } from '@/components/button-send';
import Loading from '@/components/loading';

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
    const response = await api.post('/predict', { 
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
    
    // const pragues = response.data.map((concept: any) => {
    //   return {
    //     name: concept.data.pred_class.charAt(0).toUpperCase() + concept.data.pred_class.slice(1),
    //     percentage: `${Math.round(concept.data.pred_prob[0] * 100)}%`
    //   }
    // })

    const pragues = response.data.map((concept: any) => {
      const probabilities = concept.data.pred_prob.map((prob: number) => Math.round(prob * 100));
      const [maxPerc, minPerc] = [Math.max(...probabilities), Math.min(...probabilities)];

      let nameMax, nameMin

      if (concept.data.pred_class === 'praga') {
        nameMax = 'Praga';
        nameMin = 'Saudável';
      } 

      if (concept.data.pred_class === 'saudavel') {
        nameMax = 'Saudável';
        nameMin = 'Praga';
      }

      return [{ name: nameMax, percentage: `${maxPerc}%` }, { name: nameMin, percentage: `${minPerc}%` }];
    });

    console.log(pragues)

    setItems(pragues.flat())
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
                {/* ajustar o código para usar o componente Item */}
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