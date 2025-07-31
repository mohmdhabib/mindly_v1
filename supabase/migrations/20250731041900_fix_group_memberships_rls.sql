DROP POLICY "Allow group admins to manage memberships" ON group_memberships;

CREATE POLICY "Allow group admins to manage memberships" ON group_memberships
FOR ALL
USING (
  (
    SELECT creator_id
    FROM study_groups
    WHERE id = group_memberships.group_id
  ) = auth.uid()
);
