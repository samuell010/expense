// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs

// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs

Table user {
  id integer [primary key]
  username varchar
  password varchar
  created_at timestamp
  saved_address_id integer
  default_setting_id integer
  report_list_id integer
}

Table default_settings {
  following_default_setting_id integer
  currency varchar
  language  varchar
  date_format varchar
}
Ref: user.default_setting_id > default_settings.following_default_setting_id

Table saved_addresses {
  following_saved_address_id integer
  home_address_id integer
  work_address integer
}
Ref: user.saved_address_id > saved_addresses.following_saved_address_id

Table home_address {
  following_home_address_id integer
  Name varchar
  country varchar
  coordinates integer
  address varchar
}
Ref: saved_addresses.home_address_id > home_address.following_home_address_id

Ref: user.report_list_id > list_reports.report_list_following_id

Table list_reports {
report_list_following_id integer
report1_id integer
report2_id integer
report3_id integer
}
Ref: list_reports."report1_id" > report_detail."following_report1_id"
 
Table report_detail {
  following_report1_id integer
  created_at timestamp
  title varchar
  duration varchar
  description varchar
  uploaded_docs_id integer
  km_allowance_id integer
  daily_allowance_id integer
  other_expenses_id integer
}

  Table Uploaded_docs {
    uploaded_docs_following_id integer
    documments varchar
  }

  Ref: Uploaded_docs.uploaded_docs_following_id < report_detail.uploaded_docs_id

  Table km_allowance_detail {
    following_km_allowance_id integer
    description varchar
    start_point varchar
    end_point varchar
    trip_start_date varchar
    trip_end_date varchar
    trip_start_time varchar
    trip_end_time varchar
    passengers varchar
    km integer
    vehicle_info varchar
  }

  Ref: report_detail.km_allowance_id > km_allowance_detail.following_km_allowance_id
  
  Table daily_allowance {
    following_daily_allowance_id integer
    description varchar
    traveling_by_ship_plane varchar
    country_location varchar
    trip_start_date varchar
    trip_end_date varchar
    trip_start_time varchar
    trip_end_time varchar
    trip_start_timezone varchar
    trip_end_timezone varchar
    free_meals varchar
    over_5_km varchar
    over_15_km varchar
    night_allowance varchar
    times_off_id integer
  }
    Ref: report_detail.daily_allowance_id > daily_allowance.following_daily_allowance_id
    Ref: daily_allowance.times_off_id > times_off.following_times_off_id
    Table times_off {
      following_times_off_id integer
      dates varchar
    }

  Table other_expenses {
    following_other_expenses_id integer
    type varchar
    description varchar
    dates varchar
    amount integer
    country varchar
    sum integer
    VAT integer
    attachment_id integer
    comment varchar
  }
  Ref: report_detail.other_expenses_id > other_expenses.following_other_expenses_id
  Ref: other_expenses.attachment_id > attachments.following_attachment_id
    Table attachments {
      following_attachment_id integer
      attachment1_id integer
      attachment2_id integer
      attachment3_id integer
    }


Table posts {
  id integer [primary key]
  title varchar
  body text [note: 'Content of the post']
  user_id integer
  status varchar
  created_at timestamp
}

// Ref: posts.user_id > users.id // many-to-one

// Ref: users.id < follows.following_user_id

// Ref: users.id < follows.followed_user_id



