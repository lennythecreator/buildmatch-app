import JobCard from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMyJobs } from "@/hooks/useJobs";
import { useAuthStore } from "@/store/auth";
import { IconBookmark, IconBriefcase, IconChevronRight } from "@tabler/icons-react-native";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function InvestorDashboard() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { data: jobsResponse } = useMyJobs();
  const router = useRouter();
  const jobs = Array.isArray(jobsResponse) ? jobsResponse : jobsResponse?.jobs ?? [];
  const recentJobs = [...jobs]
    .sort((leftJob, rightJob) => {
      return new Date(rightJob.createdAt).getTime() - new Date(leftJob.createdAt).getTime();
    })
    .slice(0, 4);
  
  const activeJobsCount = jobs.filter(
    (job) => job.status === 'OPEN' || job.status === 'AWARDED'
  ).length;
  
  const hiredCount = jobs.filter((job) => job.awardedContractorId).length;
  
  const totalSpent = jobs
    .filter((job) => job.status === 'AWARDED' || job.status === 'COMPLETED')
    .reduce((sum, job) => sum + (job.budgetMin || 0), 0);

  const formattedSpent = totalSpent.toLocaleString('en-US', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 0,
  });
  
  return (
    <ScrollView 
      className="flex-1 bg-background" 
      contentContainerClassName="p-4 sm:p-6 lg:p-8 space-y-8"
      contentContainerStyle={{ paddingTop: insets.top + 16 }}
    >
      {/* Header Section */}
      <View className="space-y-1 mb-4">
        <Text className="text-4xl font-bold text-foreground">
          Good morning, {user?.firstName ?? "Investor"}
        </Text>
        <Text className="text-base text-foreground/60">
          Here&apos;s an overview of your project activity.
        </Text>
      </View>

      {/* Metrics Section: Single Summary Card */}
      <Card className="flex-row items-center justify-between p-4 py-6 rounded-2xl border border-border">
        
        {/* Metric 1 */}
        <View className="flex-1 items-center justify-center border-r border-border/50">
          <Text className="text-[10px] font-semibold text-foreground/50 uppercase tracking-widest mb-1 text-center">
            Active Jobs
          </Text>
          <Text className="text-2xl font-bold text-foreground">
            {activeJobsCount}
          </Text>
        </View>
        
        {/* Metric 2 */}
        <View className="flex-1 items-center justify-center border-r border-border/50">
          <Text className="text-[10px] font-semibold text-foreground/50 uppercase tracking-widest mb-1 text-center">
            Hired
          </Text>
          <Text className="text-2xl font-bold text-foreground">
            {hiredCount}
          </Text>
        </View>
        
        {/* Metric 3 */}
        <View className="flex-1 items-center justify-center">
          <Text className="text-[10px] font-semibold text-foreground/50 uppercase tracking-widest mb-1 text-center">
            Total Spent
          </Text>
          <Text className="text-2xl font-bold text-foreground">
            {formattedSpent}
          </Text>
        </View>

      </Card>

      {/* Saved Contractors Section */}
      <View className="mt-4">
        <Card className="p-0 overflow-hidden mb-8 border border-border rounded-xl">
          <View className="flex-row items-center justify-between p-4 border-b border-border/50">
            <View className="flex-row items-center space-x-2 gap-2">
              <IconBookmark size={20} color="#00264d" />
              <Text className="text-base font-semibold text-foreground">
                Saved Contractors
              </Text>
            </View>
            <IconChevronRight size={20} color="#888" />
          </View>
          <View className="p-5 flex-row justify-between items-center bg-surface">
            <Text className="text-foreground/50">
              No contractors saved yet
            </Text>
            <Button variant="ghost" textClassName="text-secondary font-medium">
              Browse Contractors
            </Button>
          </View>
        </Card>
      </View>

      {/* Recent Jobs Section */}
      <View className="space-y-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-bold text-foreground">
            Recent Jobs
          </Text>
          
              <Button variant="primary" size="sm" className="rounded-lg" onPress={()=> router.push('/post-job')}>
                Post a job
              </Button>
         
         
        </View>

        {recentJobs.length > 0 ? (
          <View className="gap-4 mt-2">
            {recentJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </View>
        ) : (
          <Card className="flex-col items-center justify-center p-12 mt-2 rounded-2xl border border-border bg-surface shadow-sm">
            <View className="w-16 h-16 rounded-full bg-border/30 items-center justify-center mb-6">
              <IconBriefcase size={32} color="#aaa" />
            </View>
            <Text className="text-lg font-semibold text-foreground mb-2">
              No jobs posted yet
            </Text>
            <Text className="text-center text-foreground/60 mb-6 max-w-sm">
              Post your first job to start receiving bids from qualified contractors in your area.
            </Text>
            <Button variant="primary" size="md">
              Post your first job
            </Button>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}
