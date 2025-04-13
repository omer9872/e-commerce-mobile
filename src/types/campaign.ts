export interface CampaignCondition {
  type: 'purchase' | 'visit';
  amount: number;
}

export interface CampaignReward {
  type: 'points' | 'discount';
  amount: number;
}

export interface Campaign {
  _id: string;
  name: string;
  description: string;
  image: string;
  conditions: CampaignCondition[];
  reward: CampaignReward;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
} 