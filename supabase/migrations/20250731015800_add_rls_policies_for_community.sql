-- RLS policies for posts
CREATE POLICY "Allow public read access to posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Allow users to create their own posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to update their own posts" ON posts FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to delete their own posts" ON posts FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for post_interactions
CREATE POLICY "Allow public read access to post interactions" ON post_interactions FOR SELECT USING (true);
CREATE POLICY "Allow users to create their own post interactions" ON post_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to delete their own post interactions" ON post_interactions FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for study_groups
CREATE POLICY "Allow public read access to study groups" ON study_groups FOR SELECT USING (true);
CREATE POLICY "Allow users to create study groups" ON study_groups FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Allow group creators to update their groups" ON study_groups FOR UPDATE USING (auth.uid() = creator_id) WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Allow group creators to delete their groups" ON study_groups FOR DELETE USING (auth.uid() = creator_id);

-- RLS policies for group_memberships
CREATE POLICY "Allow public read access to group memberships" ON group_memberships FOR SELECT USING (true);
CREATE POLICY "Allow users to join study groups" ON group_memberships FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to leave study groups" ON group_memberships FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Allow group admins to manage memberships" ON group_memberships FOR ALL USING (
  (
    SELECT role
    FROM group_memberships
    WHERE group_id = group_memberships.group_id AND user_id = auth.uid()
  ) = 'admin'
);
