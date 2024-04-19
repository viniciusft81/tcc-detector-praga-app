import { useState, useRef, useMemo } from 'react';
import { Alert, Image, Text, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { router } from 'expo-router'

import { api } from '@/services/api'

import { Button } from '@/components/button'
import { Item, ItemProps } from '@/components/item';
import Loading from '@/components/loading';
import { ButtonGallery } from '@/components/button-gallery';
import { MenuResult } from '@/components/menu-result';
import { MaterialIcons } from '@expo/vector-icons';
import { ModalResult } from '@/components/modal-result';

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
  const [menuResult, setMenuResult] = useState(false);
  const [incorrect, setIncorrect] = useState(false);
  const [openModal, setOpenModal] = useState(false)

  let imageBase64: string | undefined

  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ['7%', '25%', '50%', '53%'], [])

  function handleCloseMenuResult() {
    setMenuResult(!menuResult)
  }

  function handleOpenMenuResult() {
    setMenuResult(true)
  }

  function handleResultIncorrect() {
    setIncorrect(true)
    handleCloseMenuResult()
    setOpenModal(true)
  }

  async function handleTakePicture() {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== ImagePicker.PermissionStatus.GRANTED) {
        return Alert.alert('É necessário conceder permissão para acessar a câmera!')
      }

      setIsLoading(true)

      const response = await ImagePicker.launchCameraAsync({
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
        imageBase64 = imgManipuled.base64
        setSelectedImageUri(imgManipuled.uri)
        pragueDetect(imgManipuled.base64)
      }
    } catch (error) {
      console.log(error)
    }
  }

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
        imageBase64 = imgManipuled.base64
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
        {name: "Praga", percentage: `${Math.round(data.prague_prob*100)}%`},
        {name: "Praga", percentage: `${Math.round(data.prague_prob*100)}%`},
        {name: "Praga", percentage: `${Math.round(data.prague_prob*100)}%`},
        {name: "Praga", percentage: `${Math.round(data.prague_prob*100)}%`},
        {name: "Praga", percentage: `${Math.round(data.prague_prob*100)}%`},

      ]
    }

    console.log(newItems)
    setItems(newItems)
    setIsLoading(false)
    setMenuResult(true)
  }

  return (
    <View className='flex-1 bg-white'>

      <Button onPress={handleTakePicture} disabled={isLoading} />
      <ButtonGallery onPress={handleSelectImage} disabled={isLoading} />
      {
        selectedImageUri ?
          <Image
            source={{ uri: selectedImageUri }}
            className='flex-1'
            resizeMode="cover"
          />
          :
          <Text className='text-green-600 font-body text-center text-sm flex-1 mt-4 py-52'>
            Selecione ou fotografe sua plantação para analisar.
          </Text>
      }

      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: '#D0D5DB' }}
      >
        <View className="border-b-[1px] border-green-700/20 z-10">
          <Text className="text-green-600 font-heading text-xl m-8 mb-1 self-center right-1">Resultados</Text>

          {!menuResult  &&
            <MaterialIcons 
              className={items.length === 0  ? 'hidden' : "top-2 absolute right-6 mt-5"} 
              name="feedback" size={24}
              onPress={handleOpenMenuResult} 
              color="#16a34a" 
            />
          }

        </View>
  
        {
          isLoading ? <Loading /> :
          <>
            <BottomSheetScrollView 
              showsVerticalScrollIndicator={false} 
              contentContainerStyle={{ paddingVertical: 18 }}
            >
              <View className="flex-1 gap-3">
                {
                  items.map((item, index) => (
                    <Item key={index} data={item} />
                  ))
            
                }

              </View>
            </BottomSheetScrollView>
          </>
        }
      </BottomSheet>
        {
        items.length > 0 && menuResult && 
          <MenuResult 
            onClear={handleCloseMenuResult} 
            onResultIncorrect={handleResultIncorrect} 
            onResultCorrect={() => {}} 
          />  
        }
        <ModalResult
          openModal={openModal}
          onSendImage={() => {}}
        />
    </View>
  )
}