export default {
  // Page modules (views directory)
  pages: {
    // Login page
    login: {
      title: 'Login',
      accountLogin: 'Account Login',
      subTitle: 'Please use your account and password to log in to the system',
      usernamePlaceholder: 'Please enter username',
      passwordPlaceholder: 'Please enter password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      loginButton: 'Login',
      loginButtonLoading: 'Logging in...',
      noAccount: 'Don\'t have an account?',
      register: 'Register now',
      loginSuccess: 'Login successful',
      welcomeBack: 'Welcome back',
      loginFailed: 'Login failed',
    },

    // System management pages
    system: {
      // Menu management
      menu: {
        title: 'Menu List',
        menuTitle: 'Menu Title',
        type: 'Type',
        path: 'Path',
        component: 'Component',
        menuType: 'Menu Type',
        menuIcon: 'Menu Icon',
        addMenu: 'Add Menu',
        editMenu: 'Edit Menu',
        routePath: 'Route Path',
        componentPath: 'Component Path',
        menuTitleLabel: 'Menu Title',
        menuI18nKey: 'Menu I18n Title Key',
        linkMode: 'Link Mode',
        linkAddress: 'Link Address',
        menuOrder: 'Menu Order',
        hideInMenu: 'Hide in Menu',
        hideInTabs: 'Hide in Tabs',
        hideInBreadcrumb: 'Hide in Breadcrumb',
        keepAlive: 'Keep Alive Component',
        pageLayout: 'Page Contains Layout',
        embedded: 'Embedded',
        externalLink: 'External Link',
      },

      // User management
      user: {
        title: 'User List',
        username: 'Username',
        nickname: 'User Nickname',
        nicknameShort: 'Nickname',
        gender: 'Gender',
        email: 'Email',
        phone: 'Phone Number',
        password: 'Password',
        role: 'Role',
        addUser: 'Add User',
        editUser: 'Edit User',
        usernameTooltip: 'Username',
      },

      // Role management
      role: {
        title: 'Role List',
        roleName: 'Role Name',
        roleCode: 'Role Code',
        addRole: 'Add Role',
        editRole: 'Edit Role',
        roleNameTooltip: 'Role Name',
        roleCodeTooltip: 'Role Code',
      },
    },

    // Demo pages
    demos: {
      // Wang Editor demo
      wangEditor: {
        title: 'ProWangEditor Rich Text Editor Example',
        subtitle: 'Demonstrates various usages and configuration options of ProWangEditor global component',
        basicUsage: 'Basic Usage',
        editorHeight: 'Editor Height',
        status: 'Status',
        disabled: 'Disabled',
        successStatus: 'Success Status',
        errorStatus: 'Error Status',
        warningStatus: 'Warning Status',
        usingProForm: 'Using pro-form Validation',
        usingNForm: 'Using n-form Validation',
        richText: 'Rich Text',
        submit: 'Submit',
        validate: 'Validate',
        pleaseEnterContent: 'Please enter content',
        validateSuccess: 'Validation successful',
        validateFailed: 'Validation failed',
        editorCreated: 'Editor created successfully',
        editorDestroyed: 'Editor destroyed',
      },
      // Access demo
      access: {
        // Access toggle
        toggle: {
          toggleMode: 'Toggle Permission Mode',
          toggleAccount: 'Switch Account',
          frontendControl: 'Frontend Permission Control',
          backendControl: 'Backend Permission Control',
          afterToggleCheck: 'Check [Left Menu -> System Management] after switching permission mode',
          afterAccountCheck: 'Check [Left Menu -> System Management] after switching account',
          superAdmin: 'Super Administrator',
          admin: 'Administrator',
          user: 'Regular User',
        },
      },

      // Icon demo
      icon: {
        remoteSearch1: 'Remote Search - Style 1',
        remoteSearch2: 'Remote Search - Style 2',
        singleIcon: 'Single Icon',
        multipleIcon: 'Multiple Icons',
        remoteSearchTooltip1: 'Remote search options when echoing',
        remoteSearchTooltip2: 'Merge options when echoing',
      },
      nested: {
        title: 'Nested Route Demo',
        description: 'Demonstrates nested routing functionality, including list and detail pages',
        goToDetail: 'Click to go to detail page',
        detailTitle: 'Detail Page',
        detailDescription: 'Detail page that is not in the menu but can highlight the menu',
        backToList: 'Back to list',
      },
    },

    // Home page
    home: {
      welcomeBack: 'Welcome back',
      today: 'Today is',
      completed: 'Completed',
      inProgress: 'In Progress',
      newMessages: 'New Messages',
      comparedToLastWeek: 'vs last week',
      totalVisits: 'Total Visits',
      totalUsers: 'Total Users',
      totalOrders: 'Total Orders',
      totalRevenue: 'Total Revenue',
      activityLog: 'Activity Log',
      recentUserActivity: 'Recent User Activity',
      viewAll: 'View All',
      projectUpdates: 'Project Updates',
      systemAnnouncementsAndUpdates: 'System Announcements & Updates',
      // Activity types
      activities: {
        completedTask: 'completed task',
        commentedDocument: 'commented on document',
        uploadedFile: 'uploaded file',
        createdTask: 'created task',
        updatedStatus: 'updated status',
        solvedProblem: 'solved problem',
        mergedCode: 'merged code',
        closedIssue: 'closed issue',
      },
      targets: {
        systemArchitectureDesign: 'System Architecture Design',
        productRequirements: 'Product Requirements',
        databaseDesign: 'Database Design',
        frontendDevelopment: 'Frontend Development',
        backendDevelopment: 'Backend Development',
        testingAndDeployment: 'Testing and Deployment',
        documentation: 'Documentation',
      },
      // Project updates
      updates: {
        newVersionRelease: 'New Version Release',
        newVersionDesc: 'Version v2.3.0 has been successfully released, fixing multiple known issues',
        systemMaintenanceNotice: 'System Maintenance Notice',
        systemMaintenanceDesc: 'The system will undergo routine maintenance this Saturday, estimated to take 2 hours',
        featureUpdatePreview: 'Feature Update Preview',
        featureUpdateDesc: 'The next version will add a data analysis module, stay tuned',
        securityUpdateReminder: 'Security Update Reminder',
        securityUpdateDesc: 'All users are advised to update their passwords promptly to enhance account security',
        userFeedbackImprovement: 'User Feedback Improvement',
        userFeedbackDesc: 'Based on user feedback, optimized interface interaction and response speed',
        newFeatureResearch: 'New Feature Research',
        newFeatureDesc: 'Researching AI intelligent analysis features, welcome to provide suggestions',
      },
      // Time
      time: {
        minutesAgo: 'minutes ago',
        hourAgo: 'hour ago',
        yesterday: 'yesterday',
        daysAgo: 'days ago',
        weekAgo: 'week ago',
        today: 'today',
      },
    },
  },

  // Common component modules (components directory)
  common: {
    // Layout components
    layout: {
      // User avatar component
      userAvatar: {
        documentation: 'Documentation',
        logout: 'Logout',
        logoutConfirmTitle: 'Confirm',
        logoutConfirmContent: 'Are you sure you want to logout?',
      },

      // Tab menu component
      tabs: {
        pin: 'Pin',
        unpin: 'Unpin',
        closeLeft: 'Close Left',
        closeRight: 'Close Right',
        closeOthers: 'Close Others',
        closeAll: 'Close All',
        openInNewWindow: 'Open in New Window',
      },
    },

    // Error page components
    fallback: {
      403: {
        title: 'Access Denied',
        description: 'You do not have permission to access this page',
      },
      404: {
        title: 'Page Not Found',
        description: 'The page you are looking for was not found',
      },
      500: {
        title: 'Server Error',
        description: 'The server is having a break, please try again later',
      },
      backHome: 'Back to Home',
    },

    // Preference setting components
    preference: {
      title: 'Preference Settings',
      resetConfig: 'Reset Config',
      copyConfig: 'Copy Config',
      other: 'Other',
      layout: {
        title: 'Layout',
        vertical: 'Vertical Layout',
        horizontal: 'Horizontal Layout',
        mixedTwoColumn: 'Mixed Two-column Layout',
        sidebar: 'Sidebar Layout',
        mixedSidebar: 'Mixed Sidebar Layout',
        fullContent: 'Full Content Layout',
        twoColumn: 'Two-column Layout',
        chrome: 'Chrome',
        card: 'Card',
        showLogo: 'Show Logo',
        layoutMode: 'Layout Mode',
        header: 'Header',
        showHeader: 'Show Header',
        fixedHeader: 'Fixed Header',
        headerHeight: 'Header Height',
        tabbar: 'Tab Bar',
        showTabbar: 'Show Tab Bar',
        fixedTabbar: 'Fixed Tab Bar',
        tabbarHeight: 'Tab Bar Height',
        showTabbarIcon: 'Show Tab Bar Icon',
        tabbarTheme: 'Tab Bar Theme',
        cacheTab: 'Cache Tab',
        showSidebar: 'Show Sidebar',
        mixedSidebarFixed: 'Mixed Sidebar Fixed',
        sidebarCollapsed: 'Sidebar Collapsed',
        sidebarWidth: 'Sidebar Width',
        collapsedWidth: 'Collapsed Width',
        showSidebarTitle: 'Show Sidebar Title',
        showMenuTitle: 'Show Menu Title When Collapsed',
        sidebarTitleWidth: 'Sidebar Title Width',
        footer: 'Footer',
        showFooter: 'Show Footer',
        fixedFooter: 'Fixed Footer',
        footerHeight: 'Footer Height',
        animationMode: 'Animation Mode',
        none: 'None',
        fade: 'Fade',
        fadeSlide: 'Fade Slide',
        fadeBottom: 'Fade Bottom',
        fadeScale: 'Fade Scale',
        zoomFade: 'Zoom Fade',
        zoomOut: 'Zoom Out',
      },
      theme: {
        title: 'Theme',
        followSystem: 'Follow System',
        light: 'Light',
        dark: 'Dark',
        themeColor: 'Theme Color',
        primaryColor: 'Primary Color',
        grayMode: 'Gray Mode',
        colorWeakness: 'Color Weakness Mode',
      },
      app: {
        routeTransition: 'Route Transition',
        fade: 'Fade',
        fadeUp: 'Fade Up',
        fadeDown: 'Fade Down',
        fadeSlide: 'Fade Slide',
        none: 'None',
      },
    },

    // Common status and options
    status: {

      // Gender options
      male: 'Male',
      female: 'Female',
      other: 'Other',

      // Menu types
      directory: 'Directory',
      menu: 'Menu',
      button: 'Button',

      // Link methods
      newWindow: 'New Window',
      iframe: 'iframe',

      // Roles
      admin: 'Administrator',
      user: 'Regular User',
      guest: 'Guest',
      super: 'Super Administrator',
    },

    // Common texts
    often: {
      status: 'Status',
      remark: 'Remark',
      operation: 'Operation',
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      index: 'Index',
      deleteConfirm: 'Confirm delete',
      deleteQuestion: '?',
      deleteSuccess: 'Delete successful',
      createTime: 'Create Time',
      updateTime: 'Update Time',
      cancel: 'Cancel',
      confirm: 'Confirm',
      close: 'Close',
      success: 'Success',
      failed: 'Failed',
      operationSuccess: 'Operation successful',
      enable: 'Enable',
      disable: 'Disable',
    },
  },

  // Route titles
  routes: {
    home: 'Home',
    login: 'Login',
    demo: 'Demo',
    system: 'System Management',
    userManagement: 'User Management',
    roleManagement: 'Role Management',
    menuManagement: 'Menu Management',
    access: 'Access',
    accessToggle: 'Access Toggle',
    exception: 'Exception Page',
    richText: 'Rich Text',
    externalPage: 'External Page',
    complexForm: 'Complex Form',
    editTable: 'Edit Table',
    embedded: 'Embedded',
    externalOpenRoute: 'External Open Route',
    noLayout: 'No Layout',
    menuManagementExternal: 'Menu Management (External)',
    baiduIframe: 'Baidu (iframe)',
    menuManagementIframe: 'Menu Management (iframe)',
    iframeLoadFailed: 'iframe Load Failed',
    externalLink: 'External Link',
    iconSelector: 'Icon Selector',
    nestedDetail: 'Nested Detail',
    detail: 'Detail',
  },
} as const
