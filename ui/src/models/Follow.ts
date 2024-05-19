export type Follow = {
  id: string;
  followerId: string;
  followingId: string;
  created: Date;
};

export type Follower = {
  followerId: string;
  created: Date;
};

export type Following = {
  followingId: string;
  created: Date;
};
