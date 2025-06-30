
-- Add RLS policies for consultants table
CREATE POLICY "Users can view consultant profiles" ON public.consultants
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own consultant profile" ON public.consultants
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own consultant profile" ON public.consultants
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update any consultant profile" ON public.consultants
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'owner')
    )
  );
