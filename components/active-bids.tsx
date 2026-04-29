import { useActiveBids } from '@/hooks/use-active-bids';
import { IconBriefcase } from '@tabler/icons-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import BidCard from './bid-card';

export default function ActiveBids() {
    const { bids } = useActiveBids();

    return (
        <View>
            <View>
                <View>
                    <IconBriefcase />
                    <Text>Active Bids</Text>
                    <TouchableOpacity>Browse Jobs</TouchableOpacity>
                </View>
                <View>
                    {bids.map(bid => (
                        <BidCard key={bid.id} bid={bid} viewAs="contractor" />
                    ))}
                </View>      
            </View>
            
            <View>
                <Text>Your Reliability Score</Text>
            </View>

            
        </View>
    );
}