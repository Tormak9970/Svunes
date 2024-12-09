use std::f32::consts::PI;

use rustfft::FftPlanner;
use rustfft::num_complex::Complex;

use crate::playback::types::Equalizer;

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
fn balance_packet(packet: f64, channel_index: u64, channel_count: usize, balance: f64) -> f64 {
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


// Function to apply a Hann window to a buffer of samples
fn apply_hann_window(buffer: &mut [f32]) {
  let n = buffer.len();
  
  for i in 0..n {
    buffer[i] *= 0.5 * (1.0 - (2.0 * PI * i as f32 / (n as f32 - 1.0)).cos());
  }
}

/// Performs a FFT to figure out the frequencies of each sample.
pub fn calculate_frequency_bins(buffer: &[f32], sample_rate: u32) -> Vec<f32> {
  let fft_size = buffer.len().next_power_of_two();

  let mut samples = buffer.to_vec().clone();
  apply_hann_window(&mut samples);
  
  let mut planner = FftPlanner::<f32>::new();
  let fft = planner.plan_fft_forward(fft_size);

  let mut fft_buffer: Vec<Complex<f32>> = vec![Complex::new(0.0, 0.0); fft_size];

  for i in 0..(buffer.len()) {
    fft_buffer[i] = Complex::new(samples[i], 0.0);
  }

  fft.process(&mut fft_buffer);
  
  
  let mut frequencies = Vec::new();
  for i in 0..(buffer.len()) {
    let freq = (i as f32 * sample_rate as f32) / fft_size as f32;
    frequencies.push(freq);
  }

  return frequencies;
}

/// Calculates the linear gain based on the provided decible value.
fn linear_gain(db: u8) -> f64 {
  return 10.0f64.powf((db as f64) / 10.0f64);
}

/// Applies the provided equalizer to the packet.
fn equalize_packet(packet: f64, frequency: f32, eq: Equalizer) -> f64 {
  let mut gain = 1;

  if frequency <= 32.0 {
    gain = eq.band32;
  } else if frequency <= 64.0 {
    gain = eq.band64;
  } else if frequency <= 125.0 {
    gain = eq.band125;
  } else if frequency <= 250.0 {
    gain = eq.band250;
  } else if frequency <= 500.0 {
    gain = eq.band500;
  } else if frequency <= 1000.0 {
    gain = eq.band1000;
  } else if frequency <= 2000.0 {
    gain = eq.band2000;
  } else if frequency <= 4000.0 {
    gain = eq.band4000;
  } else if frequency <= 8000.0 {
    gain = eq.band8000;
  } else if frequency <= 16000.0 {
    gain = eq.band16000;
  }

  return packet * linear_gain(gain);
}

/// Adjusts audio packets based on the volume, balance, and eq
pub fn adjust_packet(
  packet: f64,
  index: u64,
  channel_count: usize,
  frequency: f32,
  volume: f64,
  balance: f64,
  eq: Equalizer
) -> f64 {
  let balanced = balance_packet(packet, index, channel_count, balance);
  let equalized = equalize_packet(balanced, frequency, eq);

  return equalized * volume;
}