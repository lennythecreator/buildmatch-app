import {View, Text, FlatList} from 'react-native'
export default function ReliabilityScore() {
    const score = 0 || null 
    const steps = [
        "Respond to investor messages quickly",
        "Deliver work that matches your bid amout",
        "COmplete all milestones on time to build your track record"
    ]
    return (
        <View>
            <Text>Reliability Score</Text>z
            <View>
                {score ?(
                    <Text>{score}</Text>
                ):(
                    <View>
                        <Text>Your score will appear after you complete your first job.</Text>
                        <FlatList data={steps} renderItem={({item}) => <Text>{item}</Text>}></FlatList>
                    </View>
                )}
            </View>
        </View>
    )
}