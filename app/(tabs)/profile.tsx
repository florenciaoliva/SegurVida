import { cn } from "@/lib/utils";
import { useState } from "react";
import { Alert, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { id: "1", name: "Juan García", relationship: "Padre", phone: "+54 11 1234-5678" },
  { id: "2", name: "María García", relationship: "Madre", phone: "+54 11 2345-6789" },
  { id: "3", name: "Carlos García", relationship: "Hermano", phone: "+54 11 3456-7890" },
  { id: "4", name: "Ana Rodríguez", relationship: "Esposa", phone: "+54 11 4567-8901" },
  { id: "5", name: "911", relationship: "Emergencias", phone: "911" },
];

export default function Profile() {
  const [selectedContact, setSelectedContact] = useState<EmergencyContact | null>(
    EMERGENCY_CONTACTS[0]
  );
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleSelectContact = (contact: EmergencyContact) => {
    setSelectedContact(contact);
    setDropdownVisible(false);
    Alert.alert(
      "Contacto Actualizado",
      `${contact.name} ha sido seleccionado como tu contacto de emergencia principal`
    );
  };

  return (
    <View className="flex-1 p-5 bg-gray-100">
      <Text className="text-3xl font-bold mt-16 mb-2 text-gray-800 text-center">
        Perfil
      </Text>
      <Text className="text-lg text-gray-600 mb-10 text-center">
        Configura tus preferencias de emergencia
      </Text>

      <View className="mb-6">
        <Text className="text-base font-medium mb-2 text-gray-800">
          Contacto de Emergencia Principal
        </Text>
        <TouchableOpacity
          className={cn(
            "border-2 rounded-lg px-3 py-4 bg-white",
            dropdownVisible ? "border-blue-500" : "border-gray-300"
          )}
          onPress={() => setDropdownVisible(!dropdownVisible)}
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              {selectedContact ? (
                <>
                  <Text className="text-base text-gray-800 font-medium">
                    {selectedContact.name}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {selectedContact.relationship} • {selectedContact.phone}
                  </Text>
                </>
              ) : (
                <Text className="text-base text-gray-400">Seleccionar contacto</Text>
              )}
            </View>
            <Text className="text-gray-400 text-lg">{dropdownVisible ? "▲" : "▼"}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View className="bg-blue-50 p-4 rounded-lg">
        <Text className="text-sm text-blue-800">
          ℹ️ Este contacto recibirá las alertas de emergencia cuando presiones el botón de
          emergencia en la pantalla principal.
        </Text>
      </View>

      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/30"
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View className="flex-1 justify-center px-5">
            <View className="bg-white rounded-lg max-h-96">
              <View className="border-b border-gray-200 px-4 py-3">
                <Text className="text-lg font-semibold text-gray-800">
                  Seleccionar Contacto de Emergencia
                </Text>
              </View>
              <ScrollView className="max-h-80">
                {EMERGENCY_CONTACTS.map((contact) => (
                  <TouchableOpacity
                    key={contact.id}
                    className={cn(
                      "px-4 py-3 border-b border-gray-100",
                      selectedContact?.id === contact.id && "bg-blue-50"
                    )}
                    onPress={() => handleSelectContact(contact)}
                  >
                    <Text
                      className={cn(
                        "text-base font-medium",
                        selectedContact?.id === contact.id ? "text-blue-600" : "text-gray-800"
                      )}
                    >
                      {contact.name}
                    </Text>
                    <Text
                      className={cn(
                        "text-sm",
                        selectedContact?.id === contact.id ? "text-blue-500" : "text-gray-600"
                      )}
                    >
                      {contact.relationship} • {contact.phone}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}