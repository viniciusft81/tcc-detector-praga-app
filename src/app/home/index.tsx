import { useState, useRef, useMemo, useEffect } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import BottomSheet from '@gorhom/bottom-sheet'

import Animated, { 
  useSharedValue, 
  withSpring, 
  useAnimatedStyle, 
} from 'react-native-reanimated'

import { api } from '@/services/api'

import { Button } from '@/components/button'
import { Item, ItemProps } from '@/components/item';
import Loading from '@/components/loading';
import { ButtonGallery } from '@/components/button-gallery';


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
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);


  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ['7%', '25%', '50%', '53%'], [])

  const handleBottomSheetOpen = () => {
    setBottomSheetOpen(true);
  };

  const handleBottomSheetClose = () => {
    setBottomSheetOpen(false);
  };

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

  const translateY = useSharedValue(0);

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withSpring(translateY.value) }],
    };
  });
  
  const updateButtonPosition = () => {
    const translateYValue = bottomSheetOpen ? 200 : 0; // modifica a altura dos botões
    translateY.value = translateYValue;
  };

  useEffect(() => {
    updateButtonPosition();
  }, [bottomSheetOpen]);

  return (
    <View className='flex-1 bg-white'>
      
      <Animated.View style={[{zIndex: 10}, buttonAnimatedStyle]}>
        <Button onPress={handleTakePicture} disabled={isLoading} />

        <ButtonGallery onPress={handleSelectImage} disabled={isLoading} />
      </Animated.View>

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
        onChange={(index) => {
          if (index === 1) {
            handleBottomSheetOpen();
          } else {
            handleBottomSheetClose();
          }
        }}
      >
        <Text className="text-green-600 font-heading text-xl m-8 self-center right-1">Resultados</Text>

        {
          isLoading ? <Loading /> :
          <>
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
      </BottomSheet>
    </View>
  )
}