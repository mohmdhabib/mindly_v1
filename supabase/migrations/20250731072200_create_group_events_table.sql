CREATE TABLE group_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE group_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow group members to view events" ON group_events FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM group_memberships
    WHERE group_id = group_events.group_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Allow group members to insert events" ON group_events FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1
    FROM group_memberships
    WHERE group_id = group_events.group_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Allow event creators to delete their events" ON group_events FOR DELETE USING (
  user_id = auth.uid()
);
