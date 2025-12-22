-- This script will seed sample data for the first user who signs up
-- It will only run if the user has no transactions yet

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get the first user (for demo purposes)
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;
  
  -- Only seed if user exists and has no transactions
  IF v_user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.transactions WHERE user_id = v_user_id) THEN
    
    -- Insert sample transactions
    INSERT INTO public.transactions (user_id, name, description, amount, type, category, date, status) VALUES
    (v_user_id, 'Acme Corp', 'Project payment', 15000, 'income', 'Revenue', CURRENT_DATE - INTERVAL '0 days', 'completed'),
    (v_user_id, 'Office Supplies', 'Monthly office supplies', 450, 'expense', 'Operations', CURRENT_DATE - INTERVAL '1 days', 'completed'),
    (v_user_id, 'Tech Solutions Inc', 'Consulting services', 8500, 'income', 'Revenue', CURRENT_DATE - INTERVAL '2 days', 'completed'),
    (v_user_id, 'Marketing Campaign', 'Social media ads', 3200, 'expense', 'Marketing', CURRENT_DATE - INTERVAL '3 days', 'completed'),
    (v_user_id, 'GlobalTech Ltd', 'Software license', 12000, 'income', 'Revenue', CURRENT_DATE - INTERVAL '4 days', 'completed'),
    (v_user_id, 'Web Hosting', 'Annual hosting fee', 890, 'expense', 'Technology', CURRENT_DATE - INTERVAL '5 days', 'completed'),
    (v_user_id, 'Startup Inc', 'Development work', 22000, 'income', 'Revenue', CURRENT_DATE - INTERVAL '6 days', 'pending'),
    (v_user_id, 'Employee Salaries', 'December payroll', 45000, 'expense', 'Salaries', CURRENT_DATE - INTERVAL '7 days', 'completed'),
    (v_user_id, 'Cloud Services', 'AWS monthly bill', 1200, 'expense', 'Technology', CURRENT_DATE - INTERVAL '10 days', 'completed'),
    (v_user_id, 'Client Payment', 'Website redesign', 18500, 'income', 'Revenue', CURRENT_DATE - INTERVAL '12 days', 'completed');

    -- Insert sample budgets
    INSERT INTO public.budgets (user_id, category, amount, period, start_date, end_date) VALUES
    (v_user_id, 'Operations', 35000, 'monthly', DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day'),
    (v_user_id, 'Marketing', 20000, 'monthly', DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day'),
    (v_user_id, 'Salaries', 50000, 'monthly', DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day'),
    (v_user_id, 'Technology', 18000, 'monthly', DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day');

    -- Insert sample invoices
    INSERT INTO public.invoices (user_id, invoice_number, client_name, client_email, amount, status, issue_date, due_date, description) VALUES
    (v_user_id, 'INV-001', 'Acme Corporation', 'billing@acme.com', 15000, 'paid', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE - INTERVAL '15 days', 'Website development project'),
    (v_user_id, 'INV-002', 'Tech Solutions Inc', 'accounts@techsol.com', 8500, 'paid', CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '5 days', 'Consulting services - Q4'),
    (v_user_id, 'INV-003', 'Startup Inc', 'finance@startup.io', 22000, 'sent', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '20 days', 'Mobile app development'),
    (v_user_id, 'INV-004', 'GlobalTech Ltd', 'ap@globaltech.com', 12000, 'overdue', CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE - INTERVAL '15 days', 'Annual software license'),
    (v_user_id, 'INV-005', 'Enterprise Co', 'billing@enterprise.com', 28500, 'draft', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'Cloud infrastructure setup');

  END IF;
END $$;
