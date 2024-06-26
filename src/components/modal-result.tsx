import { Text, View, Modal, TextInput, StatusBar, Touchable, TouchableOpacity } from 'react-native';
import { ButtonSend } from './button-send';
import { MaterialIcons } from '@expo/vector-icons';

type ModalResultProps = {
  openModal: boolean;
  label: string;
  onSendImage: () => void;
  onHandleToggleModal: () => void;
  onChangeLabel: (text: string) => void;
}

export function ModalResult({ openModal, onSendImage, onHandleToggleModal, label, onChangeLabel }: ModalResultProps) {
  return (
    <View className="justify-center items-center z-10">
      <Modal
        animationType='fade'
        transparent={true}
        visible={openModal}
        onRequestClose={onHandleToggleModal}
      >
        <StatusBar backgroundColor={'#0000003F'} /> 
        <View className="flex-1 justify-center items-center bg-black/25 z-10">
          <View className="bg-[#052E39] rounded-2xl p-4 w-10/12 justify-center items-center z-10">
            <View className="pt-6 mb-3 z-10">
              <TouchableOpacity
                activeOpacity={0.7}
                className="absolute -right-4 top-2" 
                onPress={onHandleToggleModal}
              >
                <MaterialIcons 
                  name="close" 
                  size={24}
                  color={'#065f46'} 
                />
              </TouchableOpacity>

              <Text className="font-heading text-xl mt-8 text-white">Correção da inferência</Text>
            </View>
        
            <View className="w-10/12 gap-6 mt-7 ml-4 pt-8 items-center justify-center">
              <TextInput 
                placeholder="Rótulo correto da imagem..."
                placeholderTextColor={'#D0D5DB'}
                cursorColor={'#065f46'}
                className="border-b-2 border-emerald-800 text-white font-body px-2 py-1 w-full focus:border h-14 rounded-sm"
                value={label}
                onChangeText={onChangeLabel}  
              />
            </View>
      
            <View className="mt-8 mb-6 pt-8 w-4/5 ml-3 mr-3 z-10">
              <ButtonSend message="Enviar" onSendImage={onSendImage} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}