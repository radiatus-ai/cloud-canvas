// func GetCurrentGoogleUser(userId string, userEmail string) (GoogleUser, error) {
//   // Pre-conditions
//   if userId == "" {
//       return GoogleUser{}, errors.New("userId is blank")
//   }
//   if userEmail == "" {
//       return GoogleUser{}, errors.New("userEmail is blank")
//   }

//   log.Debug().
//       Str("userId", userId).
//       Str("userEmail", userEmail).
//       Send()

//   ctx := context.Background()

//   // Instantiate a new People service
//   peopleService, err := people.NewService(ctx, option.WithAPIKey(GoogleAPIKey))
//   if err != nil {
//       return GoogleUser{}, err
//   }

//   // Define the resource name using the user id
//   var resourceName string = fmt.Sprintf("people/%s", userId)

//   // Get the user profile
// profile, err := peopleService.People.Get(resourceName).PersonFields("names,photos").Do()
//   if err != nil {
//       return GoogleUser{}, err
//   }

//   log.Debug().
//       Interface("profile", profile).
//       Send()

//   return GoogleUser{Name: profile.Names[0].DisplayName, Email: userEmail, PhotoUrl: profile.Photos[0].Url}, nil
// }
