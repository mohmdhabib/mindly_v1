CREATE TABLE group_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE group_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow group members to view files" ON group_files FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM group_memberships
    WHERE group_id = group_files.group_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Allow group members to insert files" ON group_files FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1
    FROM group_memberships
    WHERE group_id = group_files.group_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Allow file creators to delete their files" ON group_files FOR DELETE USING (
  user_id = auth.uid()
);
