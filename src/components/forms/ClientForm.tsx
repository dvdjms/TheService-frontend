import React, { Dispatch, SetStateAction, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import FormField from "@/src/components/ui/FormField";
import FormButton from '../ui/FormButton';
import { ScrollView } from 'react-native-gesture-handler';
import { colors } from '@/src/styles/globalStyles';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/authContext';
import { saveClientLocally } from '@/src/lib/clients/clientLocally';
import { saveClientDynamo } from '@/src/lib/clients/clientDynamo';


interface Props {
    setModalVisible: Dispatch<SetStateAction<boolean>>;
}

const ClientForm = ({ setModalVisible }: Props) => {
    const { subscriptionTier } = useAuth();
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [address1, setStreet1] = useState<string>('');
    const [address2, setStreet2] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [stateOrProvince, setStateOrProvince] = useState<string>('');
    const [postalCode, setPostalCode] = useState<string>('');
    const [countryCode, setCountryCode] = useState<string>('');

    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const { userId, accessToken } = useAuth();

    if(!accessToken){
        throw new Error('No access token available, please log in');
    }

    const expandAddress = () => {

    }

    const expandNote = () => {

    }

    // Function to handle login submission
    const handleSubmit = async () => {
        setLoading(true)
        setError('');

        try {
            if (!firstName || !lastName) throw new Error('First name and last name are required');
            if (!email.includes('@')) throw new Error('Username must be a valid email address');
            
            const clientData = {
                userId,
                firstName, 
                lastName,
                fullName: `${firstName} ${lastName}`,
                email,
                phone: phone || '',
                notes: notes || '',
                address1: address1 || '',
                address2: address2 || '',
                city: city || '',
                stateOrProvince: stateOrProvince || '',
                postalCode: postalCode || '',
                countryCode: countryCode || '',
            }

            if (subscriptionTier === 'free') {
                const response = saveClientLocally(clientData);
                console.log("saveClientLocally response", response)

            } else {
                const response = await saveClientDynamo(clientData, accessToken)
                console.log("saveClientToDynamo response", response)
    
            }
            setModalVisible(false);
            
        } catch (err) {
            console.error('Add client', err);
            setError('Failed to add client. Try again later.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <View style={styles.modalContainer}>
            <Text style={styles.title}>Add New Client</Text>
            <ScrollView>
                <View style={styles.nameContainer}>
                    <FormField 
                        autoFocus autoComplete="firstname" 
                        label="" 
                        value={firstName} 
                        onChangeText={setFirstName} 
                        placeholder="First name" 
                        width={0.45} 
                        keyboardType="email-address" 
                        iconName={"person-outline"} />
                    <FormField 
                        autoComplete="lastname" 
                        label="" 
                        value={lastName} 
                        onChangeText={setLastName} 
                        placeholder="Last name" 
                        width={0.45} 
                        returnKeyType={"done"} 
                        iconName={"person-outline"} />
                </View>
                <FormField 
                    autoComplete="email" 
                    label="" 
                    value={email} 
                    onChangeText={setEmail} 
                    placeholder="Email" 
                    width={0.92} 
                    returnKeyType={"done"} 
                    iconName={"mail-outline"}
                    />
                <FormField 
                    autoComplete="phone" 
                    label=""
                    value={phone} 
                    onChangeText={setPhone} 
                    placeholder="Phone number" 
                    width={0.92} 
                    returnKeyType={"done"}
                    iconName={"phone-portrait-outline"}
                    />

            <View style={styles.buttonRow1}>
                <View style={styles.locationContainer}>
       
                    <TouchableOpacity onPress={expandAddress}>             
                        <Ionicons
                            name='add-circle-outline'
                            size={25}
                            color="black"
                            style={styles.icon}
                            // onPress={() => router.back()}
                        />
                    </TouchableOpacity>
                    <Text style={styles.buttonText}>Location</Text>
                </View>
                <View style={styles.locationContainer}>
      
                    <TouchableOpacity onPress={expandNote}>              
                        <Ionicons
                            name='add-circle-outline'
                            size={25}
                            color="black"
                            style={styles.icon}
                            // onPress={() => router.back()}
                        />
                    </TouchableOpacity>
                    <Text style={styles.buttonText}>Note</Text>
                </View>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}
            </ScrollView>
                <View style={styles.buttonRow2}>
                    <FormButton OnPress={() => setModalVisible(false)} title={'Cancel'} width={0.3} />
                    <FormButton OnPress={handleSubmit} title={loading ? 'Adding client...' : 'Add client'} width={0.3} />
                </View>
        </View>
 
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        // alignItems: 'center',
        paddingTop: 7,
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        // backgroundColor: 'blue'
    },
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    error: {
        marginTop: 10,
        color: 'red',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonRow1:{
        paddingTop: 40,
        paddingLeft: 5,
        // borderWidth: 5,
        gap: 25

    },
    buttonRow2: {
        bottom: 120,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        paddingLeft: 10
    },
    icon: {
        color: 'black'
    }
});

export default ClientForm;

