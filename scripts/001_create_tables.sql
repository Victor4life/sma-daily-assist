-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user roles enum
CREATE TYPE user_role AS ENUM ('patient', 'caregiver');

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create linking codes table (for patient-caregiver connection)
CREATE TABLE IF NOT EXISTS public.linking_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_by UUID REFERENCES auth.users(id),
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patient-caregiver relationships
CREATE TABLE IF NOT EXISTS public.patient_caregivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  caregiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  linked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(patient_id, caregiver_id)
);

-- Create custom buttons for patients
CREATE TABLE IF NOT EXISTS public.custom_buttons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  color TEXT DEFAULT 'blue',
  icon_type TEXT,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create requests table (patient requests to caregivers)
CREATE TABLE IF NOT EXISTS public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  caregiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  button_id UUID REFERENCES public.custom_buttons(id) ON DELETE SET NULL,
  button_label TEXT NOT NULL,
  request_text TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  response_text TEXT,
  urgent BOOLEAN DEFAULT FALSE
);

-- Create messages table (real-time communication)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create accessibility settings table
CREATE TABLE IF NOT EXISTS public.accessibility_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  font_size TEXT DEFAULT 'normal',
  high_contrast BOOLEAN DEFAULT FALSE,
  reduce_motion BOOLEAN DEFAULT FALSE,
  screen_reader_mode BOOLEAN DEFAULT FALSE,
  dark_mode BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linking_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_buttons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accessibility_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Caregivers can view linked patient profiles" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id OR
    id IN (
      SELECT patient_id FROM public.patient_caregivers 
      WHERE caregiver_id = auth.uid()
    )
  );

-- RLS Policies for linking_codes
CREATE POLICY "Users can view their own linking codes" ON public.linking_codes
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Users can create linking codes" ON public.linking_codes
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Anyone can view a linking code (for validation)" ON public.linking_codes
  FOR SELECT USING (TRUE);

-- RLS Policies for patient_caregivers
CREATE POLICY "Users can view their relationships" ON public.patient_caregivers
  FOR SELECT USING (auth.uid() = patient_id OR auth.uid() = caregiver_id);

CREATE POLICY "Patients can link caregivers" ON public.patient_caregivers
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

-- RLS Policies for custom_buttons
CREATE POLICY "Patients can view their buttons" ON public.custom_buttons
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients can manage their buttons" ON public.custom_buttons
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update their buttons" ON public.custom_buttons
  FOR UPDATE USING (auth.uid() = patient_id);

CREATE POLICY "Patients can delete their buttons" ON public.custom_buttons
  FOR DELETE USING (auth.uid() = patient_id);

CREATE POLICY "Caregivers can view linked patient buttons" ON public.custom_buttons
  FOR SELECT USING (
    patient_id IN (
      SELECT patient_id FROM public.patient_caregivers 
      WHERE caregiver_id = auth.uid()
    )
  );

-- RLS Policies for requests
CREATE POLICY "Patients can view their requests" ON public.requests
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Caregivers can view their requests" ON public.requests
  FOR SELECT USING (auth.uid() = caregiver_id);

CREATE POLICY "Patients can create requests" ON public.requests
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Caregivers can update requests they received" ON public.requests
  FOR UPDATE USING (auth.uid() = caregiver_id);

-- RLS Policies for messages
CREATE POLICY "Users can view their messages" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update read status" ON public.messages
  FOR UPDATE USING (auth.uid() = receiver_id);

-- RLS Policies for accessibility_settings
CREATE POLICY "Users can view their settings" ON public.accessibility_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their settings" ON public.accessibility_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their settings" ON public.accessibility_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
