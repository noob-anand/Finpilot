export type QnaNode = {
  questionText: string;
  answerText: string;
  followUpQuestionIds: string[];
};

export type QnaTree = {
  [key: string]: QnaNode;
};

export const rootQuestionIds = ['cash_flow_negative', 'improve_this_month', 'summarize_health'];

export const qnaTree: QnaTree = {
  // Layer 1 - Root
  cash_flow_negative: {
    questionText: 'Why is my cash flow negative?',
    answerText: 'Negative cash flow can happen for a few reasons. It often means your cash outflows (expenses, salaries, etc.) are higher than your cash inflows (sales, payments received). This can be due to high one-time expenses, slow customer payments, or lower-than-usual sales.',
    followUpQuestionIds: ['high_expenses', 'slow_payments', 'low_sales'],
  },
  improve_this_month: {
    questionText: 'What should I improve this month?',
    answerText: 'To improve this month, focus on two key areas: increasing cash inflow and reducing outflow. You could follow up on unpaid invoices to get cash in faster, or review recent spending to see if any costs can be trimmed.',
    followUpQuestionIds: ['speed_up_invoices', 'review_spending', 'boost_sales'],
  },
  summarize_health: {
    questionText: 'Summarize my financial health.',
    answerText: 'Overall, your financial health shows a steady stream of revenue, but your expenses are also significant. Key areas to watch are your unpaid invoices, which can tie up cash, and your major expense categories like rent and marketing.',
    followUpQuestionIds: ['unpaid_invoices_impact', 'biggest_expenses', 'revenue_details'],
  },

  // Layer 2 - Follow-ups from 'cash_flow_negative'
  high_expenses: {
    questionText: 'Tell me about high expenses.',
    answerText: 'Your largest expenses recently have been rent and a significant marketing campaign. While marketing is an investment, it\'s worth evaluating its return. One-time costs can temporarily impact cash flow, so it\'s important to plan for them.',
    followUpQuestionIds: ['evaluate_marketing_roi', 'plan_for_expenses'],
  },
  slow_payments: {
    questionText: 'How do slow payments affect me?',
    answerText: 'Slow payments, represented by your unpaid and overdue invoices, mean that cash you\'ve earned isn\'t available to use. This can strain your ability to pay your own bills, even if you are profitable on paper. Improving collection time is crucial.',
    followUpQuestionIds: ['improve_collections', 'impact_on_profit'],
  },
  low_sales: {
    questionText: 'What if sales are low?',
    answerText: 'A dip in sales is the most direct cause of low cash inflow. It\'s important to understand if this is a seasonal trend, a result of a specific marketing channel underperforming, or a sign of changing customer demand.',
    followUpQuestionIds: ['analyze_sales_trends', 'marketing_performance'],
  },

  // Layer 2 - Follow-ups from 'improve_this_month'
  speed_up_invoices: {
    questionText: 'How can I speed up invoice payments?',
    answerText: 'To get paid faster, consider sending automated reminders for upcoming and overdue invoices, offering a small discount for early payment, or requiring upfront deposits for large projects. Clear payment terms are also essential.',
    followUpQuestionIds: ['setup_reminders', 'early_payment_discounts'],
  },
  review_spending: {
    questionText: 'Where can I review spending?',
    answerText: 'Your \'Capital Allocation\' chart on the dashboard is a great place to start. It shows where your money is going. Look at recurring costs like software subscriptions and discretionary spending like marketing to find potential savings.',
    followUpQuestionIds: ['analyze_subscriptions', 'marketing_performance'],
  },
  boost_sales: {
    questionText: 'How can I boost sales quickly?',
    answerText: 'To boost short-term sales, you could run a limited-time promotion, re-engage past customers with a special offer, or bundle products/services. Focus on your most profitable offerings for the biggest impact.',
    followUpQuestionIds: ['run_promotion', 'engage_past_customers'],
  },

  // Layer 2 - Follow-ups from 'summarize_health'
  unpaid_invoices_impact: {
    questionText: 'How do unpaid invoices impact health?',
    answerText: 'Unpaid invoices represent cash that you are owed but can\'t use. A high number can signal a risk to your short-term stability, as you might not have the cash on hand to cover immediate expenses. This is a key metric to monitor.',
    followUpQuestionIds: ['improve_collections', 'impact_on_profit'],
  },
  biggest_expenses: {
    questionText: 'What are my biggest expenses?',
    answerText: 'Based on your data, your most significant expenses are salaries, rent, and taxes. The \'Capital Allocation\' chart provides a visual breakdown. Regularly reviewing these large, fixed costs is vital for long-term financial health.',
    followUpQuestionIds: ['evaluate_fixed_costs', 'plan_for_expenses'],
  },
  revenue_details: {
    questionText: 'Tell me more about my revenue.',
    answerText: 'Your revenue comes from various client payments. The \'Cash Flow Overview\' chart shows the trends over the past few months. Understanding which clients or services contribute the most can help you focus your efforts.',
    followUpQuestionIds: ['analyze_sales_trends', 'client_profitability'],
  },

  // Layer 3 & 4 - Deeper Dives (mixing and matching follow-ups)
  evaluate_marketing_roi: {
    questionText: 'How do I evaluate marketing ROI?',
    answerText: 'To evaluate ROI (Return on Investment), compare the cost of a campaign to the new revenue it generated. If you spent $500 and gained $2000 in new business, your ROI is high. Track which channels bring in the most valuable customers.',
    followUpQuestionIds: [],
  },
  plan_for_expenses: {
    questionText: 'How can I plan for large expenses?',
    answerText: 'Create a simple budget or forecast. By anticipating future large costs (like taxes or equipment), you can set aside cash each month. This prevents a single large payment from causing a cash flow crisis.',
    followUpQuestionIds: [],
  },
  improve_collections: {
    questionText: 'What are the best collection tactics?',
    answerText: 'Start with friendly email reminders. If that fails, a direct phone call can be very effective. For chronically late payers, you might consider pausing services or implementing stricter payment terms for future work.',
    followUpQuestionIds: [],
  },
  impact_on_profit: {
    questionText: 'Do late payments affect my profit?',
    answerText: 'Indirectly, yes. While your profit is calculated when you earn the money, the time and resources spent chasing payments are a real cost to your business. Also, a debt that is never paid (a bad debt) becomes a direct loss.',
    followUpQuestionIds: [],
  },
  analyze_sales_trends: {
    questionText: 'How do I analyze sales trends?',
    answerText: 'Look at your monthly sales data over the last year. Are there predictable busy and slow months? Identifying these patterns helps you manage cash flow better, by saving during high months to cover the low ones.',
    followUpQuestionIds: [],
  },
  marketing_performance: {
    questionText: 'How do I check marketing performance?',
    answerText: 'Ask new customers how they found you. Use different links or discount codes for different ad platforms. This helps you identify which marketing efforts are actually bringing in customers and which ones are just costing you money.',
    followUpQuestionIds: [],
  },
  setup_reminders: {
    questionText: 'Can I automate invoice reminders?',
    answerText: 'Many accounting software platforms allow you to set up automated email reminders that are sent before, on, and after an invoice due date. This saves you time and is a professional way to follow up.',
    followUpQuestionIds: [],
  },
  early_payment_discounts: {
    questionText: 'Is offering discounts a good idea?',
    answerText: 'It can be. A small discount, like 2% for paying within 10 days, can incentivize fast payment and improve your cash flow. However, make sure the discount doesn\'t significantly eat into your profit margin.',
    followUpQuestionIds: [],
  },
  analyze_subscriptions: {
    questionText: 'How do I analyze my subscriptions?',
    answerText: 'List all your monthly or annual software subscriptions. For each one, ask: "Is this essential for my business?" and "Am I using all the features I\'m paying for?" You might find you can downgrade or cancel some services.',
    followUpQuestionIds: [],
  },
  run_promotion: {
    questionText: 'What kind of promotion should I run?',
    answerText: 'A "buy one, get one 50% off" deal, a bundle of related services at a discount, or a simple percentage-off sale can all work. Target the offer to a specific customer segment for the best results.',
    followUpQuestionIds: [],
  },
  engage_past_customers: {
    questionText: 'How do I re-engage past customers?',
    answerText: 'Send a personalized email to customers who haven\'t purchased in a while. You could offer them an exclusive "welcome back" discount or let them know about a new product or service they might be interested in.',
    followUpQuestionIds: [],
  },
  evaluate_fixed_costs: {
    questionText: 'How do I evaluate fixed costs?',
    answerText: 'Fixed costs like rent are hard to change in the short term. However, it\'s good practice to periodically review them. Is your office space still the right size? Could you renegotiate your lease? These are long-term strategic questions.',
    followUpQuestionIds: [],
  },
  client_profitability: {
    questionText: 'How do I know which clients are most profitable?',
    answerText: 'For each client, compare the revenue they generate against the time and resources you spend serving them. Some smaller, low-effort clients might actually be more profitable than large, demanding ones.',
    followUpQuestionIds: [],
  },
};
