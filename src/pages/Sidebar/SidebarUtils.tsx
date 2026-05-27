import { SideBarMenuItemType } from "../../store/store";
import {
  DashboardIcon,
  AccountCircleIcon,
  CheckCircleIcon,
  GroupIcon,
  MonetizationOnIcon,
  ShowChartIcon,
  CreditCardIcon,
  MailOutlineIcon,
  PersonIcon,
  VerifiedUserIcon,
  LockIcon,
  PeopleIcon,
  AccountTreeIcon,
  PersonAddIcon,
  TrendingUpIcon,
  PaymentsIcon,
  SupportIcon,
  AnnouncementIcon,
  EventIcon,
  SmsIcon,
} from "../Icons";
import { Pending } from "@mui/icons-material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { LucideIcons, MuiIcons } from "../Icons";

export const UserSideBarMenuItems: SideBarMenuItemType[] = [
  {
    name: "Dashboard",
    icon: <DashboardIcon />,
    path: "/user/dashboard",
    isExpandable: false,
  },
  /* {
    name: "Load Fund",
    icon: <PaymentsIcon />,
    path: "/user/load-fund",
    isExpandable: false,
  }, */
  {
    name: "New Subscription",
    icon: <PaymentsIcon />,
    path: "/user/new-subscription",
    isExpandable: false,
  },
  {
    name: "My Subscription",
    icon: <ReceiptLongIcon />,
    path: "/user/my-subscriptions",
    isExpandable: false,
  },
  {
    name: "Account Info",
    icon: <AccountCircleIcon />,
    isExpandable: true,
    subItems: [
      { name: "Profile", path: "/user/account/profile", icon: <PersonIcon /> },
      // { name: "KYC", path: "/user/account/kyc", icon: <VerifiedUserIcon /> },
      {
        name: "Change Password",
        path: "/user/account/change-password",
        icon: <LockIcon />,
      },
    ],
  },
  {
    name: "Team",
    icon: <GroupIcon />,
    isExpandable: true,
    subItems: [
      { name: "Direct", path: "/user/team/direct", icon: <PeopleIcon /> },
      { name: "Team", path: "/user/team", icon: <GroupIcon /> },
      { name: "Tree", path: "/user/team/tree", icon: <AccountTreeIcon /> },
      {
        name: "New Register",
        path: "/user/team/new-register",
        icon: <PersonAddIcon />,
      },
    ],
  },
  {
    name: "Earnings",
    icon: <MonetizationOnIcon />,
    isExpandable: true,
    subItems: [
      {
        name: "Referral Bonus",
        path: "/user/earnings/referral-bonus",
        icon: <PaymentsIcon />,
      },
      {
        name: "Level Bonus",
        path: "/user/earnings/level-benefits",
        icon: <TrendingUpIcon />,
      },
      {
        name: "Daily ROI",
        path: "/user/earnings/daily-payout",
        icon: <PaymentsIcon />,
      },
      // {
      //   name: "ROI Benefits",
      //   path: "/user/earnings/roi-benefits",
      //   icon: <TrendingUpIcon />,
      // },
    ],
  },
  {
    name: "Transactions",
    icon: <MonetizationOnIcon />,
    path: "/user/transactions",
    isExpandable: false,
  },
  /* Sub-menus collapsed into single Transactions link above
  {
    name: "Transactions",
    icon: <ShowChartIcon />,
    isExpandable: true,
    subItems: [
      { name: "RD Deposit", path: "/user/transactions", icon: <CreditCardIcon /> },
      { name: "Loan", path: "/user/loantransactions", icon: <AccountBalance /> },
    ],
  },
  */
  {
    name: "Wallet Balance",
    icon: <CreditCardIcon />,
    path: "/user/wallet",
    isExpandable: false,
  },
  {
    name: "Add-On Packages",
    icon: <PaymentsIcon />,
    path: "/user/addon-packages",
    isExpandable: false,
  },
  {
    name: "Mail Box",
    icon: <MailOutlineIcon />,
    path: "/user/mailbox",
    isExpandable: false,
  },
  {
    name: "Support",
    icon: <SupportIcon />,
    path: "/user/support-chat",
    isExpandable: false,
  },
  {
    name: "Chat",
    icon: <MailOutlineIcon />,
    path: "/user/chat",
    isExpandable: false,
  },
];



export const AdminSideBarMenuItems: SideBarMenuItemType[] = [
  {
    name: "Dashboard",
    icon: <DashboardIcon />,
    path: "/admin/dashboard",
    isExpandable: false,
  },
  {
    name: "Load Fund",
    icon: <PaymentsIcon />,
    isExpandable: true,
    subItems: [
      {
        name: "Configuration",
        path: "/admin/load-fund",
        icon: <PaymentsIcon />,
      },
      {
        name: "Requests",
        path: "/admin/addon-approvals",
        icon: <ReceiptLongIcon />,
      },
    ],
  },
  {
    name: "Members",
    icon: <GroupIcon />,
    isExpandable: true,
    subItems: [
      { name: "Members", path: "/admin/members", icon: <PeopleIcon /> },
      {
        name: "Pending Members",
        path: "/admin/members/pending",
        icon: <PersonAddIcon />,
      },
      {
        name: "Active Members",
        path: "/admin/members/active",
        icon: <CheckCircleIcon />,
      },
      {
        name: "Inactive Members",
        path: "/admin/members/inactive",
        icon: <PersonIcon />,
      },
      {
        name: "KYC Approval",
        path: "/admin/kyc-approval",
        icon: <VerifiedUserIcon />,
      },
      {
        name: "Permissions",
        path: "/admin/members/permissions",
        icon: <LockIcon />,
      },
    ],
  },

  //   name: "Package",
  //   icon: <InventoryIcon />,
  //   isExpandable: true,
  //   subItems: [
  //     {
  //       name: "Generate Package",
  //       path: "/admin/package/generate",
  //       icon: <RequestQuoteIcon />,
  //     },
  //     {
  //       name: "Package Request",
  //       path: "/admin/package/requests",
  //       icon: <ReceiptLongIcon />,
  //     },
  //     {
  //       name: "Used Package",
  //       path: "/admin/package/used",
  //       icon: <InventoryIcon />,
  //     },
  //     {
  //       name: "Unused Package",
  //       path: "/admin/package/unused",
  //       icon: <InventoryIcon />,
  //     },
  //     {
  //       name: "Package History",
  //       path: "/admin/package/history",
  //       icon: <HistoryIcon />,
  //     },
  //   ],


  {
    name: "Incomes",
    icon: <MonetizationOnIcon />,
    isExpandable: true,
    subItems: [
      // {
      //   name: "ROI Benefits",
      //   path: "/admin/income/roi-benefits",
      //   icon: <TrendingUpIcon />,
      // },
      {
        name: "Level Bonus",
        path: "/admin/income/level-benefits",
        icon: <TrendingUpIcon />,
      },
      {
        name: "Daily ROI",
        path: "/admin/income/daily-payouts",
        icon: <PaymentsIcon />,
      },
    ],
  },




  /* {
    name: "Loans",
    icon: <CreditCardIcon />,
    isExpandable: true,
    subItems: [
      {
        name: "Loan Pending",
        path: "/admin/member/pending",
        icon: <Pending />
      },
      {
        name: " Loan Processed",
        path: "/admin/member/processed",
        icon: <CardMembershipRounded />
      },

    ],
  },
  {
    name: "Repayments",
    icon: <PaymentsIcon />,
    isExpandable: true,
    subItems: [
      {
        name: "Repayments List",
        path: "/admin/repayments/list",
        icon: <PaymentsIcon />
      },
    ],
  }, */


  {
    name: "Payout",
    icon: <CreditCardIcon />,
    path: "/admin/payout",
    isExpandable: false,
  },
  /* Separate ROI menu removed and merged into Incomes */



  {
    name: "Withdraw Requests",
    icon: <Pending />,
    path: "/admin/withdraw-pending",
    isExpandable: false,
  },
  {
    name: "Transactions",
    icon: <ShowChartIcon />,
    isExpandable: true,
    subItems: [
      {
        name: "Transactions",
        path: "/admin/transactions",
        icon: <ShowChartIcon />,
      },
      {
        name: "SMS Transactions",
        path: "/admin/transactions/sms",
        icon: <SmsIcon />,
      },
    ],
  },
  {
    name: "Support Tickets",
    path: "/admin/support-tickets",
    icon: <SupportIcon />,
    isExpandable: false,
  },
  {
    name: "News",
    path: "/admin/news",
    icon: <AnnouncementIcon />,
    isExpandable: false,
  },
  {
    name: "Holidays",
    path: "/admin/holidays",
    icon: <EventIcon />,
    isExpandable: false,
  },
  {
    name: "Chat",
    path: "/admin/chat",
    icon: <MailOutlineIcon />,
    isExpandable: false,
  },
];

export const Admin01SideBarMenuItems: SideBarMenuItemType[] = [
  {
    name: "Dashboard",
    icon: <DashboardIcon />,
    path: "/admin_01/dashboard",
    isExpandable: false,
  },
  {
    name: "Administration",
    icon: <LucideIcons.Settings />,
    isExpandable: true,
    subItems: [
      { name: "Members", path: "/admin_01/members", icon: <PeopleIcon /> },
      // { name: "Agents", path: "/banking/agents", icon: <PersonIcon /> },
      // { name: "Interests", path: "/banking/interestrate", icon: <PercentIcon /> },
    ],
  },
  {
    name: "Withdrawal Requests",
    icon: <PaymentsIcon />,
    path: "/admin/withdrawal-requests",
    isExpandable: false,
  },
  /* {
    name: "Agent Assignment",
    icon: <LucideIcons.ClipboardCheck />,
    path: "/agentassignemt/agent-assignment",
    isExpandable: false,
  }, */
  /* {
    name: "Banking",
    icon: <LucideIcons.Landmark />,
    isExpandable: true,
    subItems: [
      { name: "Receipts", path: "/admin/banking/receipts", icon: <ReceiptLongIcon /> },
      { name: "Payments", path: "/admin/banking/payments", icon: <PaymentsIcon /> },
      { name: "Cash Transaction", path: "/admin/banking/cash-transaction", icon: <LucideIcons.IndianRupee /> },
    ],
  },
  {
    name: "SB Account",
    icon: <LucideIcons.Wallet />,
    isExpandable: true,
    subItems: [
      { name: "SB Opening", path: "/SBaccount/sb-opening", icon: <LucideIcons.PlusCircle /> },
      { name: "Search SB A/C", path: "/SBaccount/search-sb-acc", icon: <LucideIcons.Search /> },
      { name: "Close SB", path: "/SBaccount/close-sb", icon: <LucideIcons.XCircle /> },
    ],
  },
  {
    name: "CA Account",
    icon: <CreditCardIcon />,
    isExpandable: true,
    subItems: [
      { name: "CA Opening", path: "/CAaccount/ca-opening", icon: <LucideIcons.PlusCircle /> },
      { name: "Search CA A/C", path: "/CAaccount/search-ca-acc", icon: <LucideIcons.Search /> },
      { name: "Close CA", path: "/CAaccount/close-ca", icon: <LucideIcons.XCircle /> },
    ],
  },
  {
    name: "Recurring Deposit",
    icon: <LucideIcons.RefreshCcw />,
    isExpandable: true,
    subItems: [
      { name: "RD Opening", path: "/banking/rd-opening", icon: <LucideIcons.PlusCircle /> },
      { name: "ViewAll / Search", path: "/banking/rd-viewall", icon: <LucideIcons.Search /> },
      { name: "RD Prematurity", path: "/banking/rd-prematurity", icon: <LucideIcons.Undo2 /> },
      { name: "Pay Maturity", path: "/banking/rd-pay-maturity", icon: <PaymentsIcon /> },
      { name: "RD Calculator", path: "/banking/rd-calculator", icon: <LucideIcons.Calculator /> },
    ],
  },
  {
    name: "Fixed Deposit",
    icon: <LockIcon />,
    isExpandable: true,
    subItems: [
      { name: "FD Opening", path: "/banking/fd-opening", icon: <LucideIcons.PlusCircle /> },
      { name: "ViewAll / Search", path: "/banking/fd-viewall", icon: <LucideIcons.Search /> },
      { name: "FD Prematurity", path: "/banking/fd-prematurity", icon: <LucideIcons.Undo2 /> },
      { name: "Pay Maturity", path: "/banking/fd-pay-maturity", icon: <PaymentsIcon /> },
      { name: "FD Calculator", path: "/banking/fd-calculator", icon: <LucideIcons.Calculator /> },
    ],
  },
  {
    name: "PIGMY",
    icon: <LucideIcons.PiggyBank />,
    isExpandable: true,
    subItems: [
      { name: "Account Opening", path: "/banking/pigmy-opening", icon: <LucideIcons.PlusCircle /> },
      { name: "ViewAll / Search", path: "/banking/pigmy-viewall", icon: <LucideIcons.Search /> },
      { name: "Pre Maturity", path: "/banking/pigmy-prematurity", icon: <LucideIcons.Undo2 /> },
      { name: "Pay Maturity", path: "/banking/pigmy-pay-maturity", icon: <PaymentsIcon /> },
      { name: "Calculator", path: "/banking/pigmy-calculator", icon: <LucideIcons.Calculator /> },
    ],
  }, */
  /* {
    name: "MIS",
    icon: <ShowChartIcon />,
    isExpandable: true,
    subItems: [
      { name: "MIS Opening", path: "/banking/mis-opening", icon: <LucideIcons.PlusCircle /> },
      { name: "ViewAll / Search", path: "/banking/mis-viewall", icon: <LucideIcons.Search /> },
      { name: "Pre Maturity", path: "/banking/mis-prematurity", icon: <LucideIcons.Undo2 /> },
      { name: "Pay Maturity", path: "/banking/mis-pay-maturity", icon: <PaymentsIcon /> },
      { name: "Calculator", path: "/banking/mis-calculator", icon: <LucideIcons.Calculator /> },
    ],
  }, */
];

export const AgentSideBarMenuItems: SideBarMenuItemType[] = [
  {
    name: "Dashboard",
    icon: <MuiIcons.Dashboard />,
    path: "/agent/dashboard",
    isExpandable: false,
  },
  {
    name: "Profile",
    icon: <MuiIcons.AccountCircle />,
    path: "/agent/profile",
    isExpandable: false,
  },
  {
    name: "Collections",
    icon: <MuiIcons.ListAlt />,
    path: "/agent/collections",
    isExpandable: false,
  },
  {
    name: "Add New",
    icon: <MuiIcons.AddCircle />,
    path: "/agent/add-new",
    isExpandable: false,
  },
  {
    name: "Report",
    icon: <MuiIcons.Assessment />,
    path: "/agent/report",
    isExpandable: false,
  },
  {
    name: "Logout",
    icon: <LucideIcons.Info />,
    path: "/",
    isExpandable: false,
  },
];
