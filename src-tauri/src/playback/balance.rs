/// Balances the audio packet based on the channel setup and the packet's index
/// 
/// Assuming the channels are as follows:
/// - 0 = Front Left
/// - 1 = Front Right
/// - 2 = Center
/// - 3 = Subwoofer
/// - 4 = Rear Left
/// - 5 = Rear Right (for a 5.1 system)
/// 
/// `balance` is assumed to be from -1 (L) to 1 (R)
pub fn balance_packet(packet: f64, channel_index: u64, channel_count: usize, balance: f64) -> f64 {
  let left_balance = 1.0 - balance;
  let right_balance = 1.0 + balance;

  return match channel_count {
    1 => packet,
    2 => {
      // Stereo audio: Adjust balance between left and right channels

      if channel_index % 2 == 0 {
        // Left channel
        packet * left_balance
      } else {
        // Right channel
        packet * right_balance
      }
    },
    6 => {
      // 5.1 surround audio (6 channels)
      let front_left_balance = left_balance * 0.5;   // Front Left gets more for negative balance
      let front_right_balance = right_balance * 0.5;  // Front Right gets more for positive balance
      let rear_left_balance = left_balance * 0.3;    // Rear Left
      let rear_right_balance = right_balance * 0.3;   // Rear Right
      let center_balance = left_balance * 0.4;       // Center (adjusted lightly)
      let subwoofer_balance = 1.0;                    // Subwoofer typically doesn't need balance

      match channel_index {
        0 => packet * front_left_balance,   // Front Left
        1 => packet * front_right_balance,  // Front Right
        2 => packet * center_balance,       // Center
        3 => packet * subwoofer_balance,    // Subwoofer
        4 => packet * rear_left_balance,    // Rear Left
        5 => packet * rear_right_balance,   // Rear Right
        _ => packet,                        // Default case if there are more channels
      }
    },
    8 => {
      // 7.1 surround audio (8 channels), we assume 2 extra rear speakers (e.g., 7.1 configuration)
      let front_left_balance = left_balance * 0.5;
      let front_right_balance = right_balance * 0.5;
      let rear_left_balance = left_balance * 0.4;
      let rear_right_balance = right_balance * 0.4;
      let center_balance = left_balance * 0.4;
      let subwoofer_balance = 1.0;                       // Subwoofer usually doesn't need balance
      let surround_left_balance = left_balance * 0.2;   // Surround Left
      let surround_right_balance = right_balance * 0.2;  // Surround Right

      match channel_index {
        0 => packet * front_left_balance,        // Front Left
        1 => packet * front_right_balance,       // Front Right
        2 => packet * center_balance,            // Center
        3 => packet * subwoofer_balance,         // Subwoofer
        4 => packet * rear_left_balance,         // Rear Left
        5 => packet * rear_right_balance,        // Rear Right
        6 => packet * surround_left_balance,     // Surround Left
        7 => packet * surround_right_balance,    // Surround Right
        _ => packet,                             // Default case if there are more channels
      }
    },
    _ => {
      // More than 8 channels or an unsupported configuration
      packet
    },
  };
}

/// Adjusts audio packets based on the volume and balance
pub fn balance_audio(
  packet: f64,
  index: u64,
  channel_count: usize,
  volume: f64,
  balance: f64
) -> f64 {
  let balanced = balance_packet(packet, index, channel_count, balance);

  return balanced * volume;
}